;(function($, window, document, undefined) {
    'use strict';

    var $product = '<div class="__vitrines" v-if="chaordic.length>0" '+
            'v-bind:data-chaordic-index=\'chaordic[0].index\' '+
            'v-bind:data-impression-url=\'chaordic[0].info.impressionUrl\' ' +
            'v-bind:data-name=\'chaordic[0].info.name\' ' +
            'v-bind:data-feature=\'chaordic[0].info.feature\' ' +
            'v-bind:data-shelf=\'chaordic[0].info.shelf\' ' +
            '>' +
            '<h2 v-html="chaordic[0].info.title"></h2>' +
            '<ul class="owl-carousel">' +
                '<li class="_prd" v-for="item in chaordic[0].recommendations">' +
                    '<div class="_product" v-bind:data-prd="item.id">' +
                        '<a v-bind:href=\'item.url.replace(\"www.loja.com.br\", \"\")\' v-bind:data-tracking-url=\'item.trackingUrl\' >' +
                            '<span class="__p_img">' +
                                '<img v-bind:src=\'item.images["200x200"].replace("www.loja.vteximg.com.br", "")\' alt=""/>' +
                            '</span>' +
                            '<span class="_p_details">' +
                                '<span class="__p_name">' +
                                    '{{ item.name }}' +
                                '</span>' +
                                '<div class="yv-review-quickreview" v-bind:value="item.id"></div>' +
                                '<span class="__p_pricing_" v-if="checkStatus(item)">' +
                                    '<span class="_p_price_">' +
                                        '<span class="__p_from" v-if="hasBestPrice(item.oldPrice)">de </span>' +
                                        '<span class="__p_price" v-if="hasBestPrice(item.oldPrice)">{{ item.oldPrice.formatMoney() }}</span>' +
                                    '</span>' +
                                    '<span class="_p_priceoffer_" v-if="checkRegularPrice(item.price)">' +
                                        '<span class="__p_by" v-if="hasBestPrice(item.oldPrice)">por </span>' +
                                        '<span class="__p_priceoffer">{{ item.price.formatMoney() }}</span>' +
                                    '</span>' +
                                    '<span class="_p_intallments" v-if="hasInstallments(item.installment)">' +
                                        'em até ' +
                                        '<strong class="__p_numberinstallments">{{ item.installment.count }}x</strong> de ' +
                                        '<strong class="__p_installmentsvalue">{{ item.installment.price.formatMoney() }}</strong>' +
                                    '</span>' +
                                    '<span class="__p_details_btn">mais detalhes</span>' +
                                    '<span class="__p_buy_btn">Confira</span>' +
                                '</span>' +                    
                                '<span class="__p_outstock" v-else>Produto não disponível</span>' +                    
                            '</span>' +
                        '</a>' +
                    '</div>' +
                '</li>' +
            '</ul>';

    // Registro
    window.hasInstallments = function (arg) {
        if("object"==typeof arg&&arg==null) return false;
        return true;
    };
    window.checkRegularPrice = function (arg) {
        return !("object"==typeof arg&&null==arg || "number"==typeof arg&&arg>10000);
    };
    window.hasBestPrice = function (arg) {
        return !("object"==typeof arg&&null==arg || "number"==typeof arg&&arg>10000);
    };
    window.checkStatus = function (arg) {
        return arg.status=="available";
    };

    var startChaordic = function(chaordicData){
        // Registro
        var index = 0;
        $.each(chaordicData, function (label,levels) {
            $.each(levels, function (ndx,level) {
                $('._'+label).append('<chaordic/>');
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
                            var data = {
                                            index: index,
                                            info: {
                                                title: level.title,
                                                name: level.name,
                                                feature: level.feature,
                                                shelf: label,
                                                impressionUrl: level.impressionUrl
                                            },
                                            recommendations: level.displays[0].recommendations
                                        };
                            _this.makeChaordic(data);
                        },
                        makeChaordic(data){
                            this.chaordic = [data];
                        }
                    }
                });
                new Vue({
                    el: '._'+label
                });
                index++;
            });
        });
        "function"==typeof setWaypoints&&setWaypoints();
        "function"==typeof chaordicTrackingUrl&&chaordicTrackingUrl();
    }

    var getChaordic = function(){
        $.ajax({
            url: "https://recs.chaordicsystems.com/v0/pages/recommendations?apiKey=LOJA&deviceId=dev001&url=MINHAURL&name=home&source=desktop&secretKey=MINHAKEY",
            dataType: 'json'
        }).done(function (data) {
            startChaordic(data);
            console.log(data);
        });
    }

    window.setWaypoints = function () {
        $('[data-impression-url]').each(function (ndx,item) {
            var waypoints = $(item).not('.__impression-on').addClass('__impression-on')
                .waypoint(function (direction) {
                    if('down'==direction){
                        var url = $(item).attr('data-impression-url')||"";
                        if(url.length>0){
                            if(!$(item).attr('data-impression-triggered')){
                                $(item).attr('data-impression-triggered','true');
                                $.get(url,function () {
                                    // nothing to do
                                });
                            }
                        }
                    }
                },{
                    offset: 200
                });
        });
    };    

    window.chaordicTrackingUrl = function () {
        $('[data-tracking-url]').not('.__track-on').addClass('__track-on')
            .on('click.chaordicTrackingUrl',function (e) {
                e.preventDefault();

                var _this = $(this);
                var url = _this.attr('data-tracking-url');
                var url2go = _this.attr('href');
                var productName = _this.find('.__p_name').text()||"";
                
                /*this will always run*/
                var _chaordicInfo = _this.parents('._chaordic-info');
                var shelf = _chaordicInfo.attr('data-shelf');
                var feature = _chaordicInfo.attr('data-feature');

                var pageName = 'home';
                if('undefined'!=typeof chaordic_meta&&'undefined'!=typeof chaordic_meta.page&&'undefined'!=typeof chaordic_meta.page.name){
                    pageName = chaordic_meta.page.name;
                }
                var pages = {
                    'home': 'Vitrine Chaordic Home'
                };
                var data = {
                    name: productName,
                    category: pages[pageName],
                    feature: feature,
                    page: pageName,
                    shelf: shelf,
                    url: url
                };
                localStorage.setItem(
                    'chaordic_data',
                    JSON.stringify(data)
                );
                /*redirect will happen after tracking is completed.*/
                window.location = url2go;                
            });
        return true;
    };

    $(function(){
        getChaordic();
    });

})(jQuery, window, document);