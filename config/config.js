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
    proxy: '',
    rejectUnauthorized: true
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'url',
      name: 'Zscaler URL',
      description:
        'The URL for your Zscaler instance.  The URL should include the scheme (https://).',
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
      name: 'Categories',
      description: `A comma separated list of Zscaler categories that URLs can be added to or removed from. The first category in the list will be used as the default category.  This option must be set to "Users can view only".`,
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
