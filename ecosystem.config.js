module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "Kytone Radio",
      script: "dist/server.js",
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
      "pre-deploy": "source ~/.bashrc",
      "post-deploy": "cd web && npm install && pm2 startOrRestart ecosystem.config.js --env production"
    },
    dev: {
      user: "curator",
      port: "15022",
      host: "central-srv.p-s.org.ua",
      ref: "origin/loopback-integration",
      repo: "git@github.com:bigcup/kytoneradio.git",
      path: "/var/www/development",
      "pre-deploy": "source ~/.bashrc",
      "post-deploy": "cd web && npm install && npm run build-server && cd .. && pm2 startOrRestart ecosystem.config.js --env dev",
      env: {
        NODE_ENV: "dev",
        MONGODB_URL: "mongodb://localhost:27017/kytone",
        PATH: "web/node_modules/.bin",
        PRIVET: "aaa"
      }
    }
  }
}
