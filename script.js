var $product =  '<div class="product" v-for="item in chaordic">' +
                    '<a v-bind:href=\'item.url\'>' +
                        '<div class="_image">' +
                            '<img v-bind:src=\'item.images["200x200"]\' alt=""/>' +
                        '</div>' +

                        '<div class="_content">' +
                            '<h3> {{ item.name }} </h3>' +

                            '<div class="_price">' +
                                '<span class="old-price"> de <span>R$ {{ item.oldPrice }}</span> </span>' +
                                '<span class="best-price"> por <span>R$ {{ item.price }}</span> </span>' +
                                '<span class="installment"> em até {{ item.installment.count }}x de R$ {{ item.installment.price }}</span>' +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                '</div>';

// Registro
Vue.component('chaordic', {
    template: $product,
    data: function () {
        return {
            chaordic: []
        }
    },
    created() {
        this.getProduct();
    },
    methods: {
        getProduct(){
            var _this = this;
            $.ajax({
                url: "https://recs.chaordicsystems.com/v0/pages/recommendations?apiKey=MINHAapiKEY&deviceId=EXEMPLO&name=home&source=mobile&secretKey=xjg139DDiaj@EXEMPLO",
                dataType: 'json'
            }).done(function (response) {
                _this.makeChaordic(response.top[0].displays[0].recommendations);
            });
        },
        makeChaordic(data){
            this.chaordic = data;
        }
    }
});

// Cria a instância raiz
new Vue({
    el: '.__vitrines'
});