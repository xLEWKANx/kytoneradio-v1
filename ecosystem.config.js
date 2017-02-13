module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "Kytone Radio",
      script: "web/server/server.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "curator",
      host: "central-srv.p-s.org.ua",
      port: "15022",
      ref: "origin/master",
      repo: "git@github.com:bigcup/kytoneradio.git",
      path: "/var/www/production",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev: {
      user: "curator",
      port: "15022",
      host: "central-srv.p-s.org.ua",
      ref: "origin/loopback-integration",
      repo: "git@github.com:bigcup/kytoneradio.git",
      path: "/var/www/development",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env: {
        NODE_ENV: "dev"
      }
    }
  }
}
