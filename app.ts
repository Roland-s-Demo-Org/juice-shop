// Include Zen firewall before any other code or imports to ensure it wraps/initializes
require('@aikidosec/firewall');

/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

require('./lib/startup/validateDependencies')().then(() => {
  const server = require('./server')
  server.start()
})