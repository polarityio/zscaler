polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  urls: Ember.computed.alias('block.data.details.urls'),
  inCategory: Ember.computed.alias('block.data.details.inCategory'),
  categories: '',
  selectedCategory: '',
  addUrlMessage: '',
  removeUrlErrorMessage: '',
  removeUrlMessage: '',
  disableAddUrlButton: true,
  disableRemoveUrlButton: true,
  categoryLookupErrorMessage: '',
  showCategoryMessage: false,
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  init() {
    const categories = this.get('block.userOptions.categories');
    const list = categories.split(',').map((item) => item.trim());
    // set the first category in the user options list as the default
    this.set('selectedCategory', list[0]);
    this.set('categories', list);
    this.loadCategory(this.get('selectedCategory'));
    this._super(...arguments);
  },
  actions: {
    addUrl: function () {
      this.set('removeUrlErrorMessage', '');
      this.set('addUrlErrorMessage', '');
      this.set('addButtonIsRunning', true);

      this.sendIntegrationMessage({
        action: 'ADD_URL',
        data: {
          entity: this.get('block.entity'),
          category: this.get('selectedCategory'),
          configuredName: this.get('configuredName')
        }
      })
        .then(() => {
          this.set(
            'addUrlMessage',
            `URL Successfully Added to ${this.get('selectedCategory')}`
          );
        })
        .catch((err) => {
          this.set('addUrlErrorMessage', JSON.stringify(`${err.meta.detail}`));
          this.set('showCategoryMessage', false);
        })
        .finally(() => {
          this.set('removeUrlMessage', '');
          this.set('showCategoryMessage', false);
          this.set('disableAddUrlButton', true);
          this.set('disableRemoveUrlButton', false);
          this.set('addButtonIsRunning', false);
          this.set('inCategory', true);
        });
    },
    removeUrl: function () {
      this.set('removeUrlErrorMessage', '');
      this.set('addUrlErrorMessage', '');
      this.set('removeButtonIsRunning', true);

      this.sendIntegrationMessage({
        action: 'REMOVE_URL',
        data: {
          entity: this.get('block.entity'),
          category: this.get('selectedCategory'),
          configuredName: this.get('configuredName')
        }
      })
        .then(() => {
          this.set(
            'removeUrlMessage',
            `URL Successfully Removed from ${this.get('selectedCategory')}`
          );
        })
        .catch((err) => {
          this.set('removeUrlErrorMessage', JSON.stringify(`${err.meta.detail}`));
          this.set('showCategoryMessage', false);
        })
        .finally(() => {
          this.set('addUrlMessage', '');
          this.set('removeButtonIsRunning', false);
          this.set('removeUrlErrorMessage', '');
          this.set('showCategoryMessage', false);
          this.set('disableAddUrlButton', false);
          this.set('disableRemoveUrlButton', true);
        });
    },
    categoryLookup: function (category) {
      this.loadCategory(category);
    }
  },
  loadCategory(category) {
    this.set('removeUrlErrorMessage', '');
    this.set('addUrlErrorMessage', '');
    this.set('addUrlMessage', '');
    this.set('removeUrlMessage', '');
    this.set('selectedCategory', category);
    this.set('loadingCategory', true);
    this.set('disableAddUrlButton', true);
    this.set('disableRemoveUrlButton', true);
    this.set('removeUrlErrorMessage', '');
    this.set('addUrlErrorMessage', '');
    this.set('showCategoryMessage', false);

    this.sendIntegrationMessage({
      action: 'CATEGORY_LOOKUP',
      data: {
        entity: this.get('block.entity'),
        category: category.toUpperCase()
      }
    })
      .then((response) => {
        // the query functions always return an array of results, this will only
        // ever be a single object, so we can just grab the first element.
        this.set('inCategory', response[0].result.body.inCategory);
        this.set('configuredName', response[0].result.body.configuredName);
      })
      .catch((err) => {
        this.set('categoryLookupErrorMessage', `${err.meta.detail}`);
      })
      .finally(() => {
        const isInCategory = this.get('inCategory');

        if (isInCategory) {
          this.set('disableRemoveUrlButton', false);
        } else if (!isInCategory) {
          this.set('disableAddUrlButton', false);
        }
        this.set('showCategoryMessage', true);
        this.set('loadingCategory', false);
        this.set('categoryLookupErrorMessage', '');
        this.get('block').notifyPropertyChange('data');
      });
  }
});
