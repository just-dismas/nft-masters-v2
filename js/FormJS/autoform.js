var Form = new function () {

    /**
     * Метод инициализации Form
     *
     * @returns {Form}
     */
    this.init = function () {

        this.submit_count = 0;
        this.form_container = $('.form-container');
        this.country_input_val = '';
        this.validationCountries = ['gb', 'ie'];
        this.messages = TRANSLATE[lang].messages;
        this.timeout;
        this.truePhone;
        this.trueEmail;
        this.preloadButton = '<svg viewBox="0 0 125 125" width="40" height="25" xmlns="http://www.w3.org/2000/svg" fill="#fff"><rect y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/><animate attributeName="y" begin="0.5s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/></rect><rect x="30" y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/><animate attributeName="y" begin="0.25s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/></rect><rect x="60" width="15" height="140" rx="6"><animate attributeName="height" begin="0s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/><animate attributeName="y" begin="0s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/></rect><rect x="90" y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/><animate attributeName="y" begin="0.25s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/></rect><rect x="120" y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/><animate attributeName="y" begin="0.5s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/></rect></svg>';
        this.comment = '';
        this.trackResponse = '';

        this.queryParams = this.getQueryParams(document.location.search);
    
        if (document.referrer.indexOf(window.location.host) !== -1) {
            var referrerUrl = new URL(document.referrer);
            if (Object.keys(this.getQueryParams(referrerUrl.search)).length) {
                this.queryParams = this.getQueryParams(referrerUrl.search);
            }
        }

        this.columns = {
            firstName: 'first_name',
            lastName: 'last_name',
            phone: 'phone',
            emailAddress: 'email_address',
            countryISO: 'countryISO',
            affiliateId: 'affiliate_id',
            offerId: 'offer_id',
            affSub: 'aff_sub',
            transactionId: 'transaction_id',
            sourceId: 'source_id',
            tsid: 'tsid',
            bcampId: 'bcamp_id',
            plid: 'plid',
            buid: 'buid',
            registration: 'registration',
            redirectTarget: 'redirectTarget',
            domain: 'domain'
        }

        this.api = 'https://api.' + this.getDomainName();
        this.blacklist = ["af", "ca", "ht", "ir", "il", "kp", "ly", "mm", "so", "sy", "tj", "tm", "us", "ua"];

        this.initFormData();
        this.changeHistory();
        this.createNewWindow();

        $.ajaxSetup({
            global: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        return this;
    }

    /**
     * Метод получения доменного имени
     *
     * @returns {void}
     */
    this.getDomainName = function (){
        var i=0,domain=document.domain,p=domain.split('.'),s='_gd'+(new Date()).getTime();
         while(i<(p.length-1) && document.cookie.indexOf(s+'='+s)==-1){
            domain = p.slice(-1-(++i)).join('.');
            document.cookie = s+"="+s+";domain="+domain+";";
        }
        document.cookie = s+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+domain+";";
        return domain;
    }

    /**
     * Метод инициализации елементов
     *
     * @returns {void}
     */
    this.initElem = function () {
        this.main_modal = $(".main-modal");
        this.post_modal = $('#postModal');
        this.congrats_modal = $('.congrats');
        this.congrats_alert = $('.congrats-left__text');
        this.call_back_modal = $("#call_back_form");
        this.alert = $('#postModal .alert');
        this.closer = $('.close-form');
        this.affiliateId = $('input[name="affid"]');
        this.affSub = $('input[name="subid"]');
        this.offerId = $('input[name="offerid"]');
        this.transactionId = $('input[name="transactionid"]');
        this.plid = $('input[name="plid"]');
        this.tsid = $('input[name="tsid"]');
        this.buid = $('input[name="buid"]');
        this.bcampId = $('input[name="bcamp_id"]');
        this.waitWindow = $('.wait-window');
        this.hiddenParamForm = $('#hiddenParamForm');
        this.telInput = $("input[name=phone]");
        this.firstname = $("input[name=firstname]");
        this.lastname = $("input[name=lastname]");
        this.fullname = $("input[name=fullname]");
        this.code = $("input[name=code]");
        this.email = $("input[name=email]");
    
        this.domainInput = $('input[name="domain"]');
        this.domainInput.val(this.domain);
    }


    /**
     * Метод смены направления написания текста
     *
     * @returns {void}
     */
    this.changeInputDirection = function() {
        this.telInput.attr('dir', 'ltr');
        this.email.attr('dir', 'ltr');
        this.code.attr('dir', 'ltr');
        this.firstname.attr('dir', 'rtl');
        this.lastname.attr('dir', 'rtl');
        this.fullname.attr('dir', 'rtl');
    }

    /**
     * Метод инициализации динамики
     *
     * @returns {void}
     */
    this.initFormData = function () {
        this.getConfig();
        if (!this.saveTrack) {
            this.createForms();
            this.initElem();
            this.hideInputs();
            this.addUrlData();
        } else {
            this.createMessengers();
            this.initElem();
            this.saveTrackSubmit();
        }
        lang === "ar" && this.changeInputDirection();
    }

    /**
     * Метод инициализации загрузки страници
     *
     * @returns {void}
     */
    this.DOMReady = function () {
        if (!this.saveTrack) {
            this.validationOnInput();
            if(!this.stopHoverValidation)
                this.validationOnHover();
            this.submitForm();
            this.initCountrySelect();
        }
        if (this.call_back_modal) this.initCallBack();
        this.form_container.find('button[type=submit]').attr('disabled', 'disabled');
    }

    /**
     * Метод инициализации call back окна
     *
     * @returns {void}
     */
    this.initCallBack = function () {
        this.call_back_modal.find(".button--inner").html("Call Back"), idleTimer = null, idleState = !1, idleWait = 6e4,

            $("*").bind("mousemove keydown scroll", function () {
                clearTimeout(idleTimer), idleState = !1, idleTimer = setTimeout(function () {
                    $("body").ready(function () {
                        $(".main-modal").is(":visible") && $(".main-modal").modal('hide'), $("#call_back_popup").modal('show')
                    }), idleState = !0
                }, idleWait)
            }), $("body").trigger("mousemove")

    }

    /**
     * Метод обработки даных с config.json
     *
     * @returns {void}
     */
    this.getConfig = function () {

        this.config = CONFIG;
        this.forms = this.config['forms'];
        this.style = this.config['style'];
        this.template = this.config['main-template'];
        this.inputs = this.config['inputs-template'];
        this.modal = this.config['modal-template'];
        this.sourceId = this.config['source-id'];
        this.registration = this.config['registration'];
        this.iframe = this.config['iframe'];
        this.iframeTemplate = this.config['iframe-template'];
        this.externalTrackers = this.config['externalTrackers'];
        this.externalTrackerEvents = this.config['externalTrackerEvents'];
        this.backOffer = this.config['backOffer'];
        this.backOfferEnabled = this.config['backOfferEnabled'];
        this.secondOffer = this.config['secondOffer'];
        this.secondOfferEnabled = this.config['secondOfferEnabled'];
        this.defaultAffiliateID = this.config['defaultAffiliateID'];
        this.defaultOfferID = this.config['defaultOfferID'];
        this.emailValidation = this.config['emailValidation'];
        this.phoneValidation = this.config['phoneValidation'];
        this.redirectTarget = this.config['redirectTarget'];
        if (this.config['validationCountries']) this.validationCountries = this.config['validationCountries'];
        this.saveTrack = this.config['saveTrack'];
        this.messengers = this.config['messengers'];
        this.enableAgentGenderSelector = this.config['enableAgentGenderSelector'];
        this.registerRedirectDelay = this.config['registerRedirectDelay'];
        this.preferredCountryList = this.config['preferredCountryList'];
        this.mainDomain = this.config['mainDomain'] || this.api;
        this.inputsAdditional = this.config['inputs-additional'];
        this.commentTemplate = this.config['commentTemplate'];
        this.trackUrl = this.config['trackUrl'] || this.api + '/fetch?';
        this.domain = this.config['domain'] || (location.host + (location.pathname !== '/' ? location.pathname.replace(/\/\w+.(html|php)/, '') : '')).slice(0, 50);
        if (this.config['trackParams']) {
            this.trackParams = typeof this.config['trackParams'] === 'string'
                ? this.config['trackParams']
                : this.toQueryString(this.config['trackParams'])
        }
        this.stopHoverValidation = this.config['stopHoverValidation'];
        this.trackersTemplates = this.config['trackersTemplates'];
        this.pixelsIds = {
            facebook: (this.config['pixelKey'] && this.queryParams[this.toCamelCase(this.config['pixelKey'])]) || this.config['pixelId'],
            google: this.config['googleKey'] && this.queryParams[this.toCamelCase(this.config['googleKey'])],
            yandex: this.config['yandexKey'] && this.queryParams[this.toCamelCase(this.config['yandexKey'])],
            tiktok: this.config['tiktokKey'] && this.queryParams[this.toCamelCase(this.config['tiktokKey'])],
            matomo: this.config['matomoKey'] && this.queryParams[this.toCamelCase(this.config['matomoKey'])]
        }
        this.requestErrorTimeout = this.config['requestErrorTimeout'] || 15;

        this.changeConfig();

    }
    
    /**
     * Метод замены config
     *
     * @returns {void}
     */
    this.changeConfig = function () {
        if (this.queryParams.reg) this.registration = this.queryParams.reg
        if (this.queryParams.bo === '1') this.backOfferEnabled = true
        if (this.queryParams.so === '1') this.secondOfferEnabled = true
    }

    /**
     * Метод изминения history
     *
     * @returns {void}
     */
    this.changeHistory = function () {
        if (this.backOfferEnabled) {
            window.history.pushState({
                link: window.location.href
            }, null, window.location.href)
            window.onpopstate = function (event) {
                var link = document.createElement('a');
                link.href = Form.backOffer;
                document.body.appendChild(link);
                link.click();
            };
        }
    }

    /**
     * Метод инициализации нового окна
     *
     * @returns {void}
     */
    this.createNewWindow = function () {
        if (this.secondOfferEnabled) {
            window.open(this.secondOffer, '_blank');
        }
    }

    /**
     * Метод создания html разметки
     *
     * @returns {void}
     */
    this.createForms = function () {

        for (var input in this.inputs) {
            this.form_container.append(this.inputs[input]);
        }

        for (var input in this.inputsAdditional) {
            this.form_container.append(this.inputsAdditional[input]);
        }

        this.form_container.append('<style>' + this.style + '</style>', this.template);
        $('body').append(this.modal, this.iframeTemplate);

    }

    /**
     * Метод создания html разметки для ссылок мессенджеров
     *
     * @returns {void}
     */
    this.createMessengers = function () {
        var links = ''
        for (var item in this.messengers) {
            links += '<a href="#" style="margin-left:5px" class="messeger-link"  data-link="' + this.messengers[item].link + '"  >' +
                '<img src="' + this.messengers[item].image + '" alt="' + this.messengers[item].name + '" >' +
                '</a>'
        }
        this.form_container.append(
            '<div style="display:flex;justify-content: space-between;" class="messeger-wrap">' +
            links +
            '</div>'
        );
        $('body').append(this.modal, this.iframeTemplate);
    }

    /**
     * Метод отправки saveTrack
     *
     * @returns {void}
     */
    this.saveTrackSubmit = function () {
        this.form_container.find('.messeger-link').on('click', function (event) {
            var link = $(this).data('link'),
                json = {},
                columns = Form.columns

            Form.sourceId && (json[columns.sourceId] = Form.sourceId);

            for (var item in Form.queryParams) {
                json[columns[item]] && json[columns[item]].val(Form.queryParams[item]);
            }

            if (!Form.queryParams.offerId) json[columns.offerId] = Form.defaultOfferID.toString();
            if (!Form.queryParams.affiliateId) json[columns.affiliateId] = Form.defaultAffiliateID.toString();


            $.post(Form.mainDomain + '/msgwebhook/savetrack', JSON.stringify(json), function (response) {
                window.location.assign(link + response.key)
            }).fail(function (res) {
                Form.alert.addClass('alert-danger').text(res.error);
                Form.main_modal ? Form.main_modal.modal('hide') : "";
                setTimeout(function () {
                    Form.post_modal.modal('show');
                }, 500)
            });

            return false
        });
    }

    this.loadExternalTrackers = function () {
        if(this.externalTrackers) {
            !window.fbq && this.pixelsIds['facebook'] && this.initTrackerThroughImage('facebook');
            for (var i = 0; i <= this.externalTrackers.length - 1; i++) {
                if (this.externalTrackers[i].position === 'head') {
                    $('head').append('<script>' + this.externalTrackers[i].code + '</script>')
                } else {
                    $('body').append('<script>' + this.externalTrackers[i].code + '</script>')
                }
            }
        } 
    }

    this.fireExternalEvents = function (event) {

        if(!this.blacklist.includes(this.country_input_val)) {

            if(this.externalTrackerEvents) {
            for (var i = 0; i <= this.externalTrackerEvents.length - 1; i++) {
                    if (this.externalTrackerEvents[i].event === event) {
                        $('body').append('<script>' + this.externalTrackerEvents[i].code + '</script>')
                    }
                } 
            }

            if(this.trackersTemplates && Array.isArray(this.trackersTemplates) && this.trackersTemplates.length) {
                for (var i = 0; i <= this.trackersTemplates.length - 1; i++) {

                    var tracker = this.trackersTemplates[i],
                        name = tracker.name,
                        events = tracker.events,
                        enabled = tracker.enabled;

                        if(Object.keys(this.pixelsIds).includes(name) && enabled && Array.isArray(events) && events.length) {
                        for (var subIndex = 0; subIndex <= events.length - 1; subIndex++) {
                                if (events[subIndex].name === event) {
                                    $('body').append('<script>' + events[subIndex].code + '</script>')
                                }
                            }  
                        }
                        
                }
            }
            
        }
    }

    /**
     * Метод замены стандартной функции регистрации на изображение
     *
     * @param {string} name
     * @param {string} id
     * @returns {void}
     */
    this.initTrackerThroughImage = function (name, id) {
      var pixelId = this.pixelsIds[name] || id;

      var names = {
        facebook: 'fbq',
        yandex: 'ym'
      }

      if (pixelId) {
        window[names[name]] = function (action, event) {
          var pixelImg = new Image(1, 1);
          switch (name) {
            case 'facebook':
                pixelImg.src = "https://www.facebook.com/tr?id=" + pixelId + "&ev=" + (event || action) + "&noscript=1";
                pixelImg.setAttribute("style", "display:none");
                break;
            case 'yandex':
                pixelImg.src = "https://mc.yandex.ru/watch/" + pixelId;
                pixelImg.setAttribute("style", "position:absolute; left:-9999px;");
                break;
          }
          pixelImg.setAttribute("referrerPolicy", "no-referrer");
          document.body.appendChild(pixelImg);
        };

      } else {
        window[names[name]] = function (method, event) {
          console.warn(name + " pixel ID is not set", { method, event });
        };
      }
    };

    /**
     * Метод регистрации инструментов веб-аналитики
     *
     * @returns {void}
     */
    this.setTrackers = function() {
        if(this.trackersTemplates && Array.isArray(this.trackersTemplates) && this.trackersTemplates.length) {
            for (var i = 0; i <= this.trackersTemplates.length - 1; i++) {

                var tracker = this.trackersTemplates[i],
                    name = tracker.name,
                    id = this.pixelsIds[name] || tracker.id,
                    enabled = tracker.enabled;

                if(enabled) {
                    switch (name) {
                        case 'facebook':
                            this.initTrackerThroughImage(name, id);
                            fbq('track','PageView');
                            break;
                        case 'yandex':
                            $('head').prepend('<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");</script>');
                            ym(id, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
                            break;
                        case 'google':
                            $('head').prepend("<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');</script>");
                            ga('create', id, 'auto');
                            ga('send', 'pageview');
                            break;
                        case 'tiktok':
                            $('head').prepend('<script> !function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};' +
                                'ttq.load("' + id +'");' + 
                                'ttq.page();' +
                            '}(window, document, "ttq");</script>')
                            break;
                        case 'matomo':
                            $('head').prepend("<script>var _paq = window._paq = window._paq || [];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function() {var u= $.FormJS('get', 'setting').external['url:first'].split('.').slice(1).join('.') + '/ajax/';" +
                                "_paq.push(['setTrackerUrl', '//api.'+u]);"+
                                "_paq.push(['setSiteId', '" + id + "']);" +
                                "var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.type='text/javascript'; g.async=true; g.src='//cdn.'+u+'lib.js'; s.parentNode.insertBefore(g,s);})();</script>");
                            break;
                        default:
                            console.warn(name + " - tracker does not exist");
                    }
                }
                
            }
        }
    }

    /**
     * Метод скрытия ненужных полей
     *
     * @returns {void}
     */
    this.hideInputs = function () {

        !this.config['modal'] ? this.closer.hide() : this.closer.show();

        for (var form in this.forms) {

            for (var param in this.forms[form].hidden) {
                
                $("#" + form).find('input[name=' + param + ']').attr({
                    'type': 'hidden',
                    'value': param !== 'country' ? this.forms[form].hidden[param] : ''
                }).siblings('label:not(#code-label)').hide();

                if (param === 'age') {
                    $("#" + form).find('input[name=age]').parent().hide()
                } else if (param === 'conditions') {
                    $("#" + form).find('input[name=conditions]').parent().hide()
                }

            }

            if (this.forms[form].hidden.hasOwnProperty('country')) {
                this.country_input_val = this.forms[form].hidden['country'];
            }

        }

    }

    /**
     * Метод заменения querystring в backOffer и secondOffer с queryParams
     *
     * @returns {void}
     */
    this.changeOffers = function (name) {
        var spliter = name.split('?');
        var domain = spliter[0];
        var queries = spliter[1];
        var newOffer = Form.getQueryParams('?' + queries);

        for (var item in newOffer) {
            this[item].val() && (newOffer[item] = this[item].val());
        }

        newOffer = Form.toQueryString(newOffer);

        return domain + '?' + newOffer
    }

    /**
     * Метод получения и добавления пареметров из трековой ссылки
     *
     * @returns {void}
     */
    this.getTrackUrl = function () {

        /* подстановка параметров в трек линк с URL, пример:{utm_id|1}*/
        var data = this.getQueryParams('?' + this.trackParams, 'default');
        for (var item in data) {

            if (data[item] && data[item].includes('|')) {
                var prop = data[item].slice(1, -1).split('|');
                for (var i = 0; i <= prop.length - 2; i++) {
                    var query = this.queryParams[this.toCamelCase(prop[i])];
                    if (query) {
                        data[item] = query;
                        break;
                    } else {
                        data[item] = prop.slice(-1)
                    }
                }
            } else if (data[item] && data[item].includes('{')) {
                var query = this.queryParams[this.toCamelCase(data[item].slice(1, -1))];
                if (query) {
                    data[item] = query;
                }
            }
        }

        /* замена параметров в трек линк с URL если есть совпадения*/
        var urlData = this.getQueryParams(document.location.search, 'default');
        for (var item in urlData) {
            if (!urlData[item]) delete urlData[item];
            if (item === 'affiliate_id') {
                if (data['aff_id'] && urlData['affiliate_id']) {
                    data['aff_id'] = urlData['affiliate_id'];
                    delete urlData['affiliate_id'];
                }
            } else {
                if (data[item] && urlData[item]) {
                    data[item] = urlData[item];
                    delete urlData[item];
                }
            }
        }
    
        if (Object.keys(urlData).length) {
            var params = this.toQueryString(data) ?
              'o=' + btoa(this.toQueryString(data) + '&' + this.toQueryString(urlData)) :
              'o=' + btoa(this.toQueryString(urlData))
        
            this.trackUrl += params;
        } else {
            this.trackUrl = this.trackUrl + 'o=' + btoa(this.toQueryString(data));
        }
    
        function fillForm(res) {
            Form.trackResponse = Form.getQueryParams('?' + res, 'default');
            var track = Form.getQueryParams('?' + res);
            for (var item in track) {
                Form[item] && !Form[item].val() && !track[item].includes('{') && Form[item].val(track[item]);
            }
        }
    
        function getCookie(name) {
            let matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
    
        return new Promise(function (resolve, reject) {
            var cookieParams = getCookie('trackParams')
        
            if (cookieParams) {
                fillForm(cookieParams)
                resolve()
            } else {
                $.get(Form.trackUrl, function (res) {
                    if (res) {
                        document.cookie = 'trackParams=' + encodeURIComponent(res) + '; max-age=1800'
                        fillForm(res)
                    }
                    resolve();
                
                })
                  .fail(function (err) {
                      reject(err);
                  });
            }
        });
    }

    /**
     * Метод парсинга URL и заполенения полей
     *
     * @returns {void}
     */
    this.addUrlData = function () {

        if (this.hiddenParamForm && this.hiddenParamForm.length > 0) {

            var html = this.hiddenParamForm.html();
            $('.form-container .form_group--hidden').html(html);

        } else {

            for (var item in Form.queryParams) {
                this[item] && this[item].val(Form.queryParams[item]);
            }

            if (this.trackParams || window.location.search) {

                this.getTrackUrl()
                    .then(function () {
                        !Form.offerId.val() && Form.offerId.val(Form.defaultOfferID);
                        !Form.affiliateId.val() && Form.affiliateId.val(Form.defaultAffiliateID);

                        if (Form.backOfferEnabled && Form.backOffer) {
                            var newBackOffer = Form.changeOffers(Form.backOffer);
                            if (newBackOffer !== '')
                                Form.backOffer = newBackOffer
                        }

                        if (Form.secondOfferEnabled && Form.secondOffer) {
                            var newSecondOffer = Form.changeOffers(Form.secondOffer);
                            if (newSecondOffer !== '')
                                Form.secondOffer = newSecondOffer
                        }
                    }).catch(function (err) {
                        throw new Error(err);
                    })

            } else {
                !Form.offerId.val() && Form.offerId.val(Form.defaultOfferID);
                !Form.affiliateId.val() && Form.affiliateId.val(Form.defaultAffiliateID);

                if (Form.backOfferEnabled && Form.backOffer) {
                    var newBackOffer = Form.changeOffers(Form.backOffer);
                    if (newBackOffer !== '')
                        Form.backOffer = newBackOffer
                }

                if (Form.secondOfferEnabled && Form.secondOffer) {
                    var newSecondOffer = Form.changeOffers(Form.secondOffer);
                    if (newSecondOffer !== '')
                        Form.secondOffer = newSecondOffer
                }
            }

        }

    }

    /**
     * Метод валидации телефона и почты c бека
     *
     * @param {object} data
     * @returns {void}
     */
    this.checkValidationRemote = function (data) {
        return new Promise(function (resolve, reject) {
            var json;
            switch (data.name) {
                case 'email':
                    json = {
                        email_address: data.value
                    };
                    break;
                case 'phone':
                    json = {
                        phone: data.value
                    };
                    break;
            }

            clearTimeout(timeout);
            var timeout = setTimeout(function(){
                reject();
            }, +Form.requestErrorTimeout * 1000)

            $.post(Form.mainDomain + '/check/' + data.name, JSON.stringify(json), function (response) {

                try {
                    var r = JSON.parse(response);
                    resolve(r.success);
                } catch (err) {
                    reject(err)
                }
                clearTimeout(timeout);
            }).fail(function (res) {
                clearTimeout(timeout);
                reject(res);
            })

        })
    }

    /**
     * Метод валидации телефона с помощю СheckMobi сервиса.
     *
     * @param {string} phone
     * @returns {void}
     */
    this.checkPhoneRemote = function (phone) {
        return new Promise(function (resolve, reject) {
            var json = {
                phone: phone
            };

            clearTimeout(timeout);
            var timeout = setTimeout(function(){
                reject();
            }, +Form.requestErrorTimeout * 1000)

            $.post(Form.mainDomain + '/check/validate-phone', JSON.stringify(json), function (response) {
                try {
                    var r = JSON.parse(response);
                    resolve(r.success);
                } catch (err) {
                    reject(err);
                }
                clearTimeout(timeout);
            }).fail(function (res) {
                clearTimeout(timeout);
                reject(res);
            })
        })
    }

    /**
     * Метод валидации кода телефона.
     *
     * @returns {void}
     */
    this.checkCodeRemote = function () {
        return new Promise(function (resolve, reject) {
            var json = {
                phone: Form.truePhone,
                code: $("input[name=code]").val()
            };

            clearTimeout(timeout);
            var timeout = setTimeout(function(){
                reject();
            }, +Form.requestErrorTimeout * 1000)

            $.post(Form.mainDomain + '/check/code', JSON.stringify(json), function (response) {
                try {
                    var r = JSON.parse(response);
                    resolve(r.success);
                } catch (err) {
                    reject(err);
                }
                clearTimeout(timeout);
            }).fail(function (res) {
                clearTimeout(timeout);
                reject(res);
            })
        })
    }

    /**
     * Метод проверки обязательных полей.
     *
     * @returns {boolean}
     */

    this.check_required_inputs = function (target) {
        var findEmpty = true
        if ($(target[0].form).find('.invalid').length > 0) findEmpty = false
        $(target[0].form).find('input[required]:not([name=code]):not([type=checkbox]):not([type=hidden]), select').each(function () {
            if ($(this).val() === "") {
                findEmpty = false
            }
        });
        $(target[0].form).find('input[type=checkbox]').each(function () {
            if (!$(this).prop("checked")) {
                findEmpty = false
            }
        });
        return findEmpty
    }

    this.validInput = function ($target, name) {
        if (name === 'phone') {
            $target.removeClass('invalid')
                .addClass('valid')
                .parent()
                .siblings('.error').text('')
                .siblings(".validation").fadeOut(200);
        } else {
            $target.removeClass('invalid')
                .addClass('valid')
                .siblings('.error').text('')
                .siblings(".validation").fadeOut(200);
        }
        if (Form.check_required_inputs($target)) {
            $target.parents('.form-container').find('button[type=submit]').removeAttr('disabled');
        }
    }

    this.invalidInput = function ($target, name) {
        if (name === 'phone') {
            $target.removeClass('valid')
                .addClass('invalid')
                .parent()
                .siblings('.error').html(Form.messages[name] || Form.messages.required)
                .siblings(".validation").fadeIn(200);
        } else {
            $target.removeClass('valid')
                .addClass('invalid')
                .siblings('.error').html(Form.messages[name] || Form.messages.required)
                .siblings(".validation").fadeIn(200);
        }
        $target.parents('.form-container').find('button[type=submit]').attr('disabled', 'disabled');
    }

    this.validCheckbox = function ($target) {
        $target.removeClass('invalid')
            .addClass('valid')
            .parent()
            .siblings('.error')
            .text('')
            .siblings(".validation")
            .fadeOut(200);
        if (Form.check_required_inputs($target)) {
            $target.parents('.form-container').find('button[type=submit]').removeAttr('disabled');
        }
    }

    this.invalidCheckbox = function ($target, name) {
        $target.parent()
            .siblings('.error')
            .html(Form.messages[name])
            .siblings(".validation").fadeIn(200);
        $target.parents('.form-container').find('button[type=submit]').attr('disabled', 'disabled');
    }

    this.check_validation = function (target) {

        var $target = target,
            validType = $target.data('validation-type'),
            val = $target.val();

        switch (validType) {

            case 'fullname':
                var rv_name = /(^[(ёЁЇїІіЄєҐґa-zA-Zа-яА-Я\u0621-\u064A\u0660-\u0669-`. )]{2,26})(\s)([(ёЁЇїІіЄєҐґa-zA-Zа-яА-Я\u0621-\u064A\u0660-\u0669-`. )]{2,26})?(\s)?([(ёЁЇїІіЄєҐґa-zA-Zа-яА-Я\u0621-\u064A\u0660-\u0669-`. )]{2,26})?(\s)?([(ёЁЇїІіЄєҐґa-zA-Zа-яА-Я\u0621-\u064A\u0660-\u0669-`. )]{2,26})$/;
                val.trim() != '' && rv_name.test(val) ?
                    Form.validInput($target) :
                    Form.invalidInput($target, validType)
                break;
            
            case 'firstname':
            case 'lastname':
                var rv_name = /(^[(a-zA-Zа-яА-Я\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-`. )]{2,26})$/;
                val = val.split(' ').join('');
                val != '' && rv_name.test(val) ?
                    Form.validInput($target) :
                    Form.invalidInput($target, validType)
                break;

            case 'email':
                var rv_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (this.emailValidation === 0) {
                    Form.validInput($target);
                } else if (this.emailValidation === 1 || this.emailValidation === undefined) {

                    val != '' && rv_email.test(val) ?
                        Form.validInput($target) :
                        Form.invalidInput($target, validType)

                } else if (this.emailValidation === 2) {

                    if (val != '' && rv_email.test(val)) {
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(function () {

                            Form.checkValidationRemote({
                                name: 'email',
                                value: val
                            }).then(function (res) {
                                Form.trueEmail = val;
                                if (res) {
                                    Form.validInput($target);
                                } else {
                                    Form.invalidInput($target, validType);
                                }
                            }).catch(function (error) {
                                Form.validInput($target, validType);
                            })
                        }, 1000)
                    } else {
                        Form.invalidInput($target, validType);
                    }

                }
                break;

            case 'phone':

                var country = Form.telInput.intlTelInput("getSelectedCountryData").iso2;
                var rv_name = /^([- _().:=+]?\d[- _().:=+]?){2,14}(\s*)?$/;

                if (this.phoneValidation === 0) {
                    Form.validInput($target, validType);
                } else if (this.phoneValidation === 1) {

                    $target.intlTelInput("isValidNumber") && $.trim(val) && rv_name.test(val) ?
                        Form.validInput($target, validType) :
                        Form.invalidInput($target, validType)

                } else if (this.phoneValidation === 3 || this.validationCountries.includes(country)) {

                    if ($target.intlTelInput("isValidNumber") && $.trim(val) && rv_name.test(val)) {

                        val = $target.intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);

                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(function () {
                            Form.checkPhoneRemote(val)
                                .then(function (res) {
                                    if (res && val === $target.intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164)) {
                                        Form.truePhone = val;
                                        Form.validInput($target, validType);
                                        $target.parents('form')
                                            .find('.form_input--group.code')
                                            .show()
                                            .find('input')
                                            .attr('type', 'number');
                                        $target.attr('disabled', 'disabled');
                                    } else {
                                        Form.invalidInput($target, validType);
                                    }
                                }).catch(function (error) {
                                    $target.intlTelInput("isValidNumber") && $.trim(val) && rv_name.test(val) ?
                                        Form.validInput($target, validType) :
                                        Form.invalidInput($target, validType)
                                })
                        }, 500)
                    } else {
                        Form.invalidInput($target, validType);
                    }


                } else if (this.phoneValidation === 2 || this.phoneValidation === undefined) {

                    if ($target.intlTelInput("isValidNumber") && $.trim(val) && rv_name.test(val)) {

                        val = $target.intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);

                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(function () {
                            Form.checkValidationRemote({
                                name: 'phone',
                                value: val
                            }).then(function (res) {
                                if (res && val === $target.intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164)) {
                                    Form.truePhone = val;
                                    Form.validInput($target, validType);
                                } else {
                                    Form.invalidInput($target, validType);
                                }
                            }).catch(function (error) {
                                $target.intlTelInput("isValidNumber") && $.trim(val) && rv_name.test(val) ?
                                    Form.validInput($target, validType) :
                                    Form.invalidInput($target, validType)
                            })
                        }, 500)
                    } else {
                        Form.invalidInput($target, validType);
                    }

                }
                break;

            case 'age':
            case 'conditions':
                !$target.prop("checked") ?
                    Form.invalidCheckbox($target, 'conditions') :
                    Form.validCheckbox($target)
                break;

            case 'code':

                if (val.length === 5) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(function () {
                        Form.checkCodeRemote()
                            .then(function (res) {
                                if (res) {
                                    Form.validInput($target);
                                    $target.attr('disabled', 'disabled')
                                } else {
                                    Form.invalidInput($target, validType);
                                }
                            }).catch(function (error) {
                                Form.validInput($target, validType);
                            })
                    }, 500)
                } else {
                    Form.invalidInput($target, validType);
                }


                break;
            default:
                $target.length > 0 && val != '' ?
                    Form.validInput($target) :
                    Form.invalidInput($target, validType)
                break;
        }
    }

    /**
     * Метод инициализации валидации
     *
     * @returns {void}
     */
    this.validationOnInput = function () {
        this.form_container.find('input, textarea, select').on('input', function (event) {
            Form.check_validation($(event.target));
        });
    }

    /**
     * Метод инициализации валидации при hover кнопки отправки формы
     *
     * @returns {void}
     */
    this.validationOnHover = function () {
        this.form_container.find('.form_group--button').on('mouseover touchstart', function (e) {
            var inputs = Form.form_container.find('input, textarea, select').not(".valid").not(":hidden")
            for (var i = 0; i <= inputs.length - 1; i++) {
                Form.check_validation($(inputs[i]))
            }
        })
    }

    this.registrationFrame = function (res, json) {
        var url = res.message;
        var ifr = document.getElementById('iframe');
        ifr.src = url.replace("http:", "https:");
        ifr.onload = function () {
            window.location.replace("app.php?username=" + json[Form.columns.firstName] + " " + json[Form.columns.lastName] + "&email=" + json[Form.columns.emailAddress]);
        };
    }

    this.registrationTrue = function (res, json) {
        if (res.code === 1) {
            if (this.iframe) {
                this.waitWindow.show()
                Form.alert.addClass('alert-success').text(Form.messages[res.code]);
                setTimeout(function () {
                    this.registrationFrame(res, json)
                }, Form.registerRedirectDelay || 5000)
            } else {
                this.waitWindow.show()
                Form.alert.addClass('alert-success').text(Form.messages[res.code]);
                setTimeout(function () {
                    window.location.assign(res.message);
                }, Form.registerRedirectDelay || 5000)
            }
        } else {
            Form.alert.addClass('alert-success').text(Form.messages[res.code]);
        }
    }

    /**
     * Метод очистки лишних пробелов
     *
     * @param {String} string
     *
     * @returns {String}
     */
    this.removeEmptySpaces = function (string) {
        return string ? string.split(' ').filter(function(item){return item}).join(' ') : '' 
    }

    /**
     * Метод создания JSON для нагрузки запросов
     *
     * @param {DOM} parent
     *
     * @returns {Object}
     */
    this.createJSON = function (parent) {

        var columns = this.columns,
            countryData = Form.telInput.intlTelInput("getSelectedCountryData"),
            json = {},
            fullname = this.removeEmptySpaces(parent.find('input[name="fullname"]').val()).split(' '),
            firstname = fullname.slice(0,-1).join(' '),
            lastname = fullname[fullname.length - 1];

        json[columns.firstName] = firstname || this.removeEmptySpaces(parent.find('input[name="firstname"]').val());
        json[columns.lastName] = lastname || this.removeEmptySpaces(parent.find('input[name="lastname"]').val());
        json[columns.emailAddress] = this.trueEmail || parent.find('input[name="email"]').val() || this.generateEmail();
        json[columns.phone] = this.truePhone || parent.find('input[name="phone"]').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
        json[columns.countryISO] = countryData.iso2;
        json[columns.affiliateId] = parent.find('input[name="affid"]').val();
        json[columns.offerId] = parent.find('input[name="offerid"]').val();
        json[columns.sourceId] = this.sourceId;
        json[columns.registration] = this.registration;

        this.redirectTarget && (json[columns.redirectTarget] = this.redirectTarget);
        parent.find('input[name="subid"]').val() && (json[columns.affSub] = parent.find('input[name="subid"]').val());
        parent.find('input[name="transactionid"]').val() && (json[columns.transactionId] = parent.find('input[name="transactionid"]').val());
        parent.find('input[name="plid"]').val() && (json[columns.plid] = parent.find('input[name="plid"]').val());
        parent.find('input[name="tsid"]').val() && (json[columns.tsid] = parent.find('input[name="tsid"]').val());
        parent.find('input[name="buid"]').val() && (json[columns.buid] = parent.find('input[name="buid"]').val());
        parent.find('input[name="bcamp_id"]').val() && (json[columns.bcampId] = parent.find('input[name="bcamp_id"]').val());
        parent.find('input[name="domain"]').val() && (json[columns.domain] = parent.find('input[name="domain"]').val());

        for (var key in this.commentTemplate) {
            var val = parent.find('[name="' + this.commentTemplate[key].slice(1,-1) + '"]').val() || (Form.trackResponse ? Form.trackResponse[this.commentTemplate[key].slice(1,-1)] : '');
            val && (this.comment += key + ':' + val  + ' ');
        }

        this.comment && (json.comment = this.comment);
        this.comment = '';

        return json
    }

    /**
     * Метод отправки запроса к sendForm
     *
     * @param {DOM} parent
     * @param {Object} json
     *
     * @returns {void}
     */
    this.sendForm = function (parent, json) {
        var $button = parent.find('button[type=submit]');
        var defaultButtonHtml = $button.html();
        $button.html(Form.preloadButton);
        $button.attr('disabled', 'disabled');

        function handleSendError(error) {
            Form.alert.addClass('alert-danger').text(error || Form.messages.error);
            Form.main_modal ? Form.main_modal.modal('hide') : "";
            clearTimeout(handleTimeout);
            var handleTimeout = setTimeout(function () {
                Form.post_modal.modal('show');
            }, 500);
            $button.html(defaultButtonHtml);
            $button.removeAttr('disabled');
        }

        clearTimeout(timeout);
        var timeout = setTimeout(function(){
            Form.fireExternalEvents('registration');
            handleSendError();
        }, +Form.requestErrorTimeout * 1000)

        $.post(Form.mainDomain + '/sendForm', JSON.stringify(json), function (response) {
            try {
                var r = JSON.parse(response);
                if (Form.registration) {
                    Form.registrationTrue(r, json)
                } else {
                    Form.congrats_alert.html(Form.messages[r.code]);
                }
                congrats();
                if (r.success === true) Form.fireExternalEvents('registration');
                $button.html(defaultButtonHtml);
                $button.removeAttr('disabled');
                Form.main_modal ? Form.main_modal.modal('hide') : "";
            } catch (err) {
                handleSendError();
            }
            clearTimeout(timeout);
            Form.submit_count++;
        }).fail(function (res) {
            try {
                var r = JSON.parse(res.responseJSON)
                if (r.code === 2 || r.code === 5 || r.code === 3) Form.submit_count++;
                if (r.code === 5 || r.code === 3) {
                    Form.congrats_alert.html(Form.messages[0]);
                    congrats();
                    $button.html(defaultButtonHtml);
                    $button.removeAttr('disabled');
                } else {
                    handleSendError(Form.messages[r.code]);
                }
            } catch (err) {
                handleSendError();
            }
            clearTimeout(timeout);
            +res.status >= 500 && Form.fireExternalEvents('registration');
        });
    }

    /**
     * Метод для FormJS плагина, передает коммент в виде аргумента
     *
     * @returns {void}
     */
    this.sendWithPopup = function (gender) {
        this.comment += 'Perferred sales agent gender: ' + gender + '; ';
        var json = this.createJSON(this.form_container);
        this.sendForm(this.form_container, json);
    }

    /**
     * Метод инициализации отпарвки формы
     *
     * @returns {void}
     */
    this.submitForm = function () {

        this.form_container.submit(function (e) {
            e.preventDefault();

            if (Form.submit_count < 3) {

                if (!$(this).find('.invalid').length) {

                    if (Form.enableAgentGenderSelector && $.FormJS) {

                        $.FormJS('saleagent').open();

                    } else {

                        var json = Form.createJSON($(this));
                        Form.sendForm($(this), json);

                    }

                } else {
                    return false;
                }

            } else {

                Form.alert.addClass('alert-danger').text(Form.messages.limit);
                Form.main_modal ? Form.main_modal.modal('hide') : "";
                setTimeout(function () {
                    Form.post_modal.modal('show');
                }, 500)

            }

        });
    }

    /**
     * Метод получения preferred стран для intlTelInput
     *
     * @returns {Array<String>} Массив кодов стран
     */
    this.getPreferredCountryList = function () {
        if (Form.preferredCountryList && Form.preferredCountryList.length) {
            return Form.preferredCountryList.join(',').toLowerCase().split(',');
        }
        return TRANSLATE[lang].preferredCountryList;
    }

    /**
     * Метод инициализации country select
     *
     * @returns {Form}
     */
    this.initCountrySelect = function () {

        Form.telInput.intlTelInput({
            initialCountry: TRANSLATE[lang].country,
            preferredCountries: this.getPreferredCountryList()
        });

        function countryChange(status) {

            Form.telInput.on("countrychange", function (e, countryData) {
                countryData.iso2 && Form.telInput.intlTelInput("setCountry", countryData.iso2);
                Form.check_validation($(this));
            });

            if(!Form.blacklist.includes(Form.country_input_val)) {
                if (status && !(+status === 200 || +status >= 500)) return false;
                Form.setTrackers();
                Form.loadExternalTrackers();
                Form.fireExternalEvents('load');
            }
        }

        if (this.country_input_val === '') {

            clearTimeout(timeout);
            var timeout = setTimeout(function(){
                countryChange();
            }, +Form.requestErrorTimeout * 1000)
            
            $.post(Form.mainDomain + '/geoip', function (response) {
                Form.country_input_val = response.toLowerCase();
                Form.telInput.intlTelInput("setCountry", Form.country_input_val);
                countryChange();
                clearTimeout(timeout);
            })
            .fail(function (err) {
                countryChange(err.status);
                clearTimeout(timeout);
            });
        } else {
            Form.telInput.intlTelInput("setCountry", Form.country_input_val);
            countryChange();
        }

    }

    /**
     * Метод парсинга URL
     *
     * @param {DOM} parent
     * @param {string} case
     * @returns {Object}
     */
    this.getQueryParams = function (str, type) {
        str = str.split('?')[1];

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(str)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        params = Form.mapKeys(params, function (val, key) {
            return !type ? Form.toCamelCase(key) : key
        });
        return params;
    }

    /**
     * Метод изменения ключей обэкта
     *
     * @param {Object} obj
     * @param {Function} fn
     * @returns {Object}
     */
    this.mapKeys = function (obj, fn) {
        return Object.keys(obj).reduce(function (acc, k) {
            acc[fn(obj[k], k, obj)] = obj[k];
            return acc;
        }, {});
    }

    /**
     * Метод переобразования строки  в camelCase.
     *
     * @param {String} str
     * @returns {String}
     */
    this.toCamelCase = function (str) {
        var s =
            str &&
            str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(function (x) {
                return x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()
            })
            .join('');
        return s.slice(0, 1).toLowerCase() + s.slice(1);
    }


    /**
     * Метод генерации рандомной почты
     *
     * @returns {string}
     */
    this.generateEmail = function () {
        var charts = Array.apply(0, Array(5)).map(function () {
            return (function (charset) {
                return charset.charAt(Math.floor(Math.random() * charset.length))
            }('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'));
        }).join('')
        var timestamp = Date.now();
        return 'nomail_' + charts + timestamp + '@mail.com'
    }

    /**
     * Метод генерации QueryString с обєкта
     *
     * @returns {string}
     */
    this.toQueryString = function (data) {
        return Object.keys(data).map(function (key) {
            return key + '=' + encodeURIComponent(data[key])
        }).join('&');
    }

}

Form.init();
$(document).ready(function () {
    Form.DOMReady();
});
