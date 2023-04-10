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
      this.clearErrorMessages();
      this.clearMessages();
      this.disableButtons();

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
            `URL successfully added to ${this.get('selectedCategory')}`
          );
          this.set('disableAddUrlButton', true);
          this.set('disableRemoveUrlButton', false);
          this.set('inCategory', true);
        })
        .catch((err) => {
          if (err.meta && err.meta.detail) {
            this.set('addUrlErrorMessage', `${err.meta.detail}`);
          } else {
            this.set('addUrlErrorMessage', JSON.stringify(err, null, 2));
          }
        })
        .finally(() => {
          this.set('showCategoryMessage', false);
          this.set('addButtonIsRunning', false);
        });
    },
    removeUrl: function () {
      this.clearErrorMessages();
      this.clearMessages();
      this.disableButtons();

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
            `URL successfully removed from ${this.get('selectedCategory')}`
          );
          this.set('disableAddUrlButton', false);
          this.set('disableRemoveUrlButton', true);
          this.set('inCategory', false);
        })
        .catch((err) => {
          if (err.meta && err.meta.detail) {
            this.set('removeUrlErrorMessage', `${err.meta.detail}`);
          } else {
            this.set('removeUrlErrorMessage', JSON.stringify(err, null, 2));
          }
        })
        .finally(() => {
          this.set('showCategoryMessage', false);
          this.set('removeButtonIsRunning', false);
        });
    },
    categoryLookup: function (category) {
      this.loadCategory(category);
    }
  },
  loadCategory(category) {
    this.clearErrorMessages();
    this.clearMessages();
    this.disableButtons();

    this.set('selectedCategory', category);
    this.set('loadingCategory', true);
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
        this.set('showCategoryMessage', true);
        const isInCategory = this.get('inCategory');
        if (isInCategory) {
          this.set('disableRemoveUrlButton', false);
        } else if (!isInCategory) {
          this.set('disableAddUrlButton', false);
        }
      })
      .catch((err) => {
        if (err.meta && err.meta.detail) {
          this.set('categoryLookupErrorMessage', `${err.meta.detail}`);
        } else {
          this.set('categoryLookupErrorMessage', JSON.stringify(err, null, 2));
        }
      })
      .finally(() => {
        this.set('loadingCategory', false);
        this.get('block').notifyPropertyChange('data');
      });
  },
  clearErrorMessages() {
    this.set('removeUrlErrorMessage', '');
    this.set('addUrlErrorMessage', '');
    this.set('categoryLookupErrorMessage', '');
  },
  clearMessages() {
    this.set('addUrlMessage', '');
    this.set('removeUrlMessage', '');
  },
  disableButtons() {
    this.set('disableRemoveUrlButton', true);
    this.set('disableAddUrlButton', true);
  }
});
