polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  urls: Ember.computed.alias('block.data.details.urls'),
  categories: '',
  isRunning: false,
  selectedCategory: '',
  addUrlErrorMessage: '',
  addUrlMessage: '',
  removeUrlErrorMessage: '',
  removeUrlMessage: '',
  removeUrlErrorMessage: '',
  removeUrlMessage: '',
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  init () {
    const categories = this.get('block.userOptions.categories');
    const list = categories.split(',');

    this.set('inCategory', 'Please Select a Category');

    this.set('categories', list);

    console.log(this.get('categories'));

    this._super(...arguments);
  },
  actions: {
    addUrl: async function (value) {
      console.log(value);
      this.set('isRunning', true);

      this.get()

      this.sendIntegrationMessage({
        action: 'ADD_URL',
        data: {
          entity: this.get('block.entity'),
          category: this.get('selectedCategory')
        }
      })
        .then((response) => {
          if (response.result.statusCode === 200) {
            this.set('addUrlMessage', 'URL Added Successfully');
          }
        })
        .catch((err) => {
          this.set('addUrlErrorMessage', err);
          this.set('error', err);
        })
        .finally(() => {
          this.set('isRunning', false);
          this.get('block').notifyPropertyChange('data');
        });
    },
    removeUrl: async function () {
      this.set('isRunning', true);

      this.sendIntegrationMessage({
        action: 'REMOVE_URL',
        data: {
          entity: this.get('block.entity')
        }
      })
        .then((response) => {
          if (response.result.statusCode === 200) {
            this.set('removeUrlMessage', 'URL Removed Successfully');
          }
        })
        .catch((err) => {
          this.set('removeUrlErrorMessage', err);
          this.set('error', err);
        })
        .finally(() => {
          this.set('isRunning', false);
          this.get('block').notifyPropertyChange('data');
        });
    },
    getCategory: function (category) {
      console.log(category);
      this.sendIntegrationMessage({
        action: 'CATEGORY_LOOKUP',
        data: {
          entity: this.get('block.entity'),
          category: category.trim()
        }
      })
        .then((response) => {
          console.log(response);
          // the query functions always return an array of results, this will only
          // ever be a single object, so we can just grab the first element.
          this.set('inCategory', response[0].result.body.inCategory);
        })
        .catch((err) => {
          this.set('error', err);
        });
    }
  }
});
