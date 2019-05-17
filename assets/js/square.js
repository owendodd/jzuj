var isDev = function () {
        var baseUrl = location.href.split("/")[2]
        return ['localhost', '127.0'].some(function (url) {
          return baseUrl.includes(url)
        })
      }
      var form = new Vue({
        el: "#form",
        data: {
          apiUrl: isDev() ? 'http://localhost:3000/' : 'https://mff5xh1kl3.execute-api.us-east-1.amazonaws.com/dev/',
          redirectUrl: isDev() ? 'http://localhost:5500/' : 'jzujfood.com',
          loading: true,
          items: [],
          stock: [],
          selectedItem: false,
          quantity: false
        },
        mounted: function () {
          this.getItems()
          this.getStock()
        },
        computed: {
          quantityAvailable: function() {
            const quantityArray = []
            if (!this.selectedItem) return quantityArray
            quantityArray[0] = 0
            const self = this
            const itemVariation = this.stock.find(function(item) {
              return item.variation_id === self.selectedItem.id
            })
            quantityArray[+itemVariation.quantity_on_hand] = +itemVariation.quantity_on_hand
            return quantityArray
          },
          price: function() {
            const price = this.selectedItem && this.selectedItem.price_money.amount * this.quantity
            if (price) {
              return `${price/100}`
            } else {
              return '0'
            }
          }
        },
        methods: {
          submit: function (e) {
            e.stopPropagation()
            this.checkout().then(function(data) {
              const redirect = data.body.checkout.checkout_page_url
              location.href = redirect
            })
          },
          checkout: function () {
            const item = Object.assign({}, this.selectedItem, {quantity: this.quantity.toString()})
            const order = {
              items: [item],
              redirect_url: this.redirectUrl,
              request_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            }
            return this.fetch(this.apiUrl + 'checkout', {
              method: 'POST',
              mode: 'cors',
              body: JSON.stringify(order)
            })
          },
          getItems: function () {
            this.fetch(this.apiUrl + 'items')
              .then(this.populateItems, this.handleFail)
          },
          getStock: function () {
            this.fetch(this.apiUrl + 'inventory')
              .then(this.populateStock, this.handleFail)
          },
          fetch: function (url, options) {
            const fetchOptions = Object.assign(
              {
                mode: 'cors'
              },
              options
            )
            return fetch(url, fetchOptions).then(function(response) { return response.json() })
          },
          populateItems: function (data) {
            this.items = data.body[0].variations
            this.loading = false
          },
          populateStock: function (data) {
            this.stock = data.body
          },
          handleFail: function (err) {
            alert('Something went wrong, please contact us.')
            console.error(err)
          }
        }
      })