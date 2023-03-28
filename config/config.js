module.exports = {
  name: 'Zscalar',
  acronym: 'Zscalar',
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
      name: 'Zscalar URL',
      description:
        'The URL for your Zscalar instance.  The URL should include the scheme (https://).',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'username',
      name: 'Zscalar Username',
      description: 'Enter the username associated with your Zscalar instance.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'password',
      name: 'Zscalar Password',
      description: 'Enter the password associated with your Zscalar instance.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'token',
      name: 'Zscalar Token',
      description: 'Enter the Zscalar API Token associated with your Zscalar account.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'categories',
      name: 'Categories',
      description: `A comma separated list of categories that can be used to add or remove urls from Zscalar
        'The first category in the list will be used as the default category.`,
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
