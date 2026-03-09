/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import challengeUtils = require('../lib/challengeUtils')
import { type Request, type Response, type NextFunction } from 'express'
import { type Review } from '../data/types'

const challenges = require('../data/datacache').challenges
const db = require('../data/mongodb')
const security = require('../lib/insecurity')

const TIMING_ATTACK_DELAY_MS = 150
const TIMING_ATTACK_THRESHOLD = 2

/**
 * Delays execution for timing attack challenge
 */
const delay = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Creates a safe query filter to prevent NoSQL injection
 */
const createSafeIdFilter = (id: string) => ({ _id: { $eq: id } })

module.exports = function productReviews () {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.body
    const user = security.authenticatedUsers.from(req)

    // Validate required parameters
    if (!id || !user?.data?.email) {
      res.status(400).json({ error: 'Invalid request parameters' })
      return
    }

    try {
      const safeFilter = createSafeIdFilter(id)
      
      // Use $eq operator to prevent NoSQL injection
      const review = await db.reviews.findOne(safeFilter)

      if (!review) {
        res.status(404).json({ error: 'Not found' })
        return
      }

      const { likedBy } = review
      const userEmail = user.data.email

      // Check if user already liked this review
      if (likedBy.includes(userEmail)) {
        res.status(403).json({ error: 'Not allowed' })
        return
      }

      // Increment like count
      await db.reviews.update(
        safeFilter,
        { $inc: { likesCount: 1 } }
      )

      // Artificial wait for timing attack challenge
      await delay(TIMING_ATTACK_DELAY_MS)

      // Fetch updated review
      const updatedReview = await db.reviews.findOne(safeFilter)

      if (!updatedReview) {
        res.status(400).json({ error: 'Wrong Params' })
        return
      }

      // Add user email to likedBy array
      const updatedLikedBy = [...updatedReview.likedBy, userEmail]

      // Count how many times user has liked (for challenge detection)
      const userLikeCount = updatedLikedBy.filter((email: string) => email === userEmail).length

      challengeUtils.solveIf(
        challenges.timingAttackChallenge, 
        () => userLikeCount > TIMING_ATTACK_THRESHOLD
      )

      // Update likedBy array
      const result = await db.reviews.update(
        safeFilter,
        { $set: { likedBy: updatedLikedBy } }
      )

      res.json(result)
    } catch (err: unknown) {
      res.status(400).json({ error: 'Wrong Params' })
    }
  }
}
