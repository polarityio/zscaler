module.exports = {
  name: 'Zscaler',
  acronym: 'ZS',
  description: `Add or remove URLs from ZScaler URL categories.`,
  styles: ['./styles/styles.less'],
  entityTypes: ['domain'],
  defaultColor: 'light-blue',
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ""
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'url',
      name: 'Zscaler API URL',
      description:
        'The URL for your Zscaler API instance. The URL should include the scheme (https://) but not the `/api/v1` path.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'username',
      name: 'Zscaler Username',
      description: 'Enter the username for your ZScaler account.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'password',
      name: 'Zscaler Password',
      description: 'Enter the password associated with your ZScaler username.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'token',
      name: 'Zscaler Token',
      description: 'Enter the Zscaler API Token associated with your Zscaler account.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'categories',
      name: 'URL Categories',
      description:
        'A comma separated list of Zscaler category IDs that URLs can be added to or removed from. The first category in the list will be used as the default category.  You can also add a user-friendly label to the category by prepending the category with a label and using a colon to separate it from the category ID (i.e., "<label>:<categoryId>"). Note that the name of the category is not the same as the category\'s ID.  See the integration README for information on finding the category ID. This option must be set to "Users can view only"',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
