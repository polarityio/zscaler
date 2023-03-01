module.exports = {
  name: "Zscalar",
  acronym: "Zscalar",
  description:
    "Zscalar is a customizable, secure, and drop-in solution to add authentication and authorization services to your applications. The Polarity Zscalar integration allows you to search for Zscalar users by email address.",
  entityTypes: ["email"],
  styles: ["./styles/styles.less"],
  defaultColor: "light-blue",
  block: {
    component: {
      file: "./components/block.js"
    },
    template: {
      file: "./templates/block.hbs"
    }
  },
  request: {
    cert: "",
    key: "",
    passphrase: "",
    ca: "",
    proxy: "",
    rejectUnauthorized: true
  },
  logging: {
    level: "info" //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: "url",
      name: "Zscalar URL",
      description:
        "URL for your Zscalar instance.  The URL should include the scheme (https://).",
      default: "",
      type: "text",
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: "username",
      name: "Zscalar Username",
      description: "Username for your Zscalar instance.",
      default: "",
      type: "text",
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: "password",
      name: "Zscalar Password",
      description: "Password for your Zscalar instance.",
      default: "",
      type: "password",
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
