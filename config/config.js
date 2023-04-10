module.exports = {
  name: 'Zscaler',
  acronym: 'ZS',
  description: `Zscaler Internet Access (ZIA) is a cloud-based security solution that provides secure and direct access to the internet for users, 
  protecting against cyber threats and ensuring compliance with organizational policies. It includes features such as web filtering, threat protection, and secure access service edge (SASE) capabilities.`,
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
    level: 'trace' //trace, debug, info, warn, error, fatal
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
      description: 'Enter the username associated with your Zscaler instance.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'password',
      name: 'Zscaler Password',
      description: 'Enter the password associated with your Zscaler instance.',
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
      description: `A comma separated list of categories that can be used to add or remove urls from Zscaler
        'The first category in the list will be used as the default category.`,
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
