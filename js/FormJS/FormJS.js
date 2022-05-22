/** FormJS - jQuery Plugin for init forms
 * @external $.FormJS
 * @version 2.1.0
 * @since 01.09.2021
 **/
 ;(function ($) {
	'use strict';

	/**
	 * @type: Object
	 * Глобальные параметры плагина
	 **/
	var plugin = {
		name: 'FormJS',
		version: '2.1.0',
		mode: 'normal',
		data: {
			setting: 'setting',
			general: 'general',
			plugin: 'plugin',
			exitpopup: 'exitpopup',
			terms: 'terms',
			waitpopup: 'waitpopup',
			saleagent: 'saleagent',
			pushmaze: 'pushmaze'
		},
		event: {
			ajax: 'ajax',
			ready: 'ready',
			exit: {
				mouse: 'exit:mouse',
				timer: 'exit:timer'
			},
			terms: {
				open: 'terms:open',
				opened: 'terms:opened',
				close: 'terms:close',
				closed: 'terms:closed'
			},
			register: {
				done: 'register:done',
				fail: 'register:fail',
				always: 'register:always'
			},
			pushmaze: {
				ready: 'pushmaze:ready'
			},
			geoip: 'geoip',
			saleagent: {
				open: 'saleagent:open',
				send: 'saleagent:send',
				close: 'saleagent:close'
			}
		},
		message: {
			invalidUrl: 'Not valid URL',
			notFound: 'File not found'
		},
		test: {
			formCSS: 'test-form-css'
		},
		ajax: {
			setup: {
				type: 'GET',
				method: 'GET',
				global: true,
				async: true,
				dataType: 'text',
				contentType: 'text/plain',
				mimeType: 'text/plain',
				dataFilter: function (data) {
					return tag(data, general.template);
				}
			},
			script: {
				success: function (script) {
					$.globalEval('try {\n\t' + script + '\n} catch (error) {\n\tconsole.error("' + plugin.name + ': Error in javascript file", "' + this.url + '", error);\n}');
				}
			},
			style: {
				success: function (style) {
					var file = this.url;
					$.each(general.$style, function () {
						if (file.includes($(this).attr('data-file'))) {
							$(this).attr('data-src', file).append(style);
						}
					});
					if (!general.$head.find('[data-src="' + file + '"]').length) {
						general.$head.prepend('<style type="text/css" data-src="' + file + '">' + style + '</style>');
					}
				}
			}
		}
	};

	/**
	 * @type: Object
	 * Параметры инициализации плагина по умолчанию
	 **/
	var defaults = {
		/**
		 * @type: String
		 * Базовый путь к файлам плагина
		 **/
		path: 'js/FormJS',

		remotePath: 'FormJSAuto',

		/**
		 * @type: Object<string>
		 * Внешние url ссылки для использования в путях файлов
		 * Ключ объекта это название переменной в шаблонизаторе
		 **/
		external: {
			// Первый URL
			'url:first': 'https://cdn.' + window.location.host,
			// URL PUSH сервера
			'url:push': 'aHR0cHM6Ly9zdXBlcnN0YXJtYXJrZXRpbmcucnUv'
		},

		/**
		 * @type: String
		 * Язык плагина
		 * EN (Английский), RU (Русский), SE (Шведский), NO (Норвежский),
		 * IT (Итальянский), PT (Португальский), DK (Датский), ES (Испанский),
		 * DE (Немецкий), AR (Арабский), FR (Французский), FL (Финский)
		 **/
		language: 'EN',

		/**
		 * @type: String
		 * Брендовый цвет сайта
		 * Используется в CSS в разных модулях, переменная в css: {color}
		 **/
		color: '#337ab7',

		/**
		 * @type: Object<string>
		 * Объект кастомных переменных шаблонизатора
		 * Переменные могут использоватся во всех подключаемых js/html/css файлах
		 * Название ключа объекта это названия переменной в шаблонизаторе
		 * Например: { test: 'custom' }, в файле FormJS.css можем использовать так: .class-{test} и получим .class-custom
		 **/
		template: {},

		/**
		 * @type: Object<object<any>>
		 * Объект стандартных параметров модулей: exitpopup, terms, congrats, missed
		 **/
		setup: {},

		/**
		 * @type: Boolean
		 * Вывод сообщений об ошибках плагина в консоль
		 **/
		logger: true,

		/**
		 * @type: Boolean
		 * Кэширование запрашиваемых js/css/html/txt файлов
		 **/
		cache: true,

		/**
		 * @type: Boolean|Object
		 * Cookie бар для соглашения и cookie политикой
		 **/
		cookie: false,

		/**
		 * @type: Object<function>
		 * !@DEPRECATED - c версии 1.3.9 (18.10.2018) заменен на setting.files.modules.terms = false
		 * !@DEPRECATED - c версии 1.9.2 (08.09.2020) заменен на setting.files.modules.terms.default = true
		 * Объект callback функций событий
		 * @param {object} data - настройки плагина
		 **/
		terms: {
			//По умолчанию включен
			default: true,
			opened: function (data) {},
			closed: function (data) {},
		},

		/**
		 * !@DEPRECATED - c версии 1.3.9 (18.10.2018) заменен на setting.files.modules.bootstrap = false
		 * @type: Boolean
		 * Загузка модального окна bootstrap для autoform.js
		 **/
		bootstrap: undefined,

		/**
		 * !@DEPRECATED - c версии 1.3.9 (18.10.2018) заменен на setting.files.modules.congrats = false
		 * @type: Boolean
		 * Вывод окна успешной регистрации
		 **/
		congrats: undefined,

		/**
		 * @type: Object | Boolean | Function
		 * Объект параметров инициализации логотипов под формой (owlCarousel)
		 **/
		logotype: false,

		pushmaze: false,

		/**
		 * @type: Boolean
		 * Двухстороняяя привязка форм
		 **/
		binding: true,

		/**
		 * @type: Boolean
		 * Модуль Missed Click
		 **/
		missed: false,

		/**
		 * @type: Boolean:false | String | Function
		 * Вывод текста Предупреждения о рисках
		 **/
		risk: false,

		/**
		 * @type: Boolean
		 * Модуль перехвата GET параметров URL для заполнения формы
		 * Двухстраничные формы
		 **/
		urlcatch: false,

		/**
		 * @type: Boolean:false | String | Function
		 * Модуль редиректа на страницу ThankU Page
		 **/
		thanku: false,

		/**
		 * @type: Object | Function | Boolean
		 * Инициализация карусели платёжных логотипов
		 **/
		payment: false,

		/**
		 * @type: Object<function> | Boolean
		 * Объект callback методов для показа exitpopup окна
		 * @param {object} popup - объект параметров и методов exitpopup окна
		 **/
		exitpopup: false,

		/**
		 * @type: Object<function> | Boolean
		 * Объект callback методов для показа waitpopup окна
		 * @param {object} popup - объект параметров и методов waitpopup окна
		 **/
		waitpopup: false,

		/**
		 * @type: Boolean
		 * Сохранять и автозаполнять содержимое input'ов формы из cookie
		 **/
		saveinput: false,

		/**
		 * @type: Boolean
		 * Создать кнопку "Показать другие страны" в плагине intlTelInput
		 **/
		preferred: true,

		/**
		 * @type: Boolean
		 * Показать html второй страницы вместо первой, после регистрации на первой форме
		 **/
		singlePage: true,

		/**
		 * @type: Object
		 * Объект параметров SaleAgent окна
		 **/
		saleagent: {
			// Объект параметров фото
			photo: {
				// Шаблон ссылки на фото агента
				template: '{url:first}/{remotePath}/img/saleagent/{region}/{gender}/{index}.jpg',
				// Диапазаон случайных значений
				range: {
					woman: [1, 1],
					man: [1, 1]
				}
			},
			// Объект параметров информации (saleagent.json)
			agent: {
				// Диапазон случайных значений
				range: {
					woman: [0, 25],
					man: [0, 25]
				}
			}
		},

		/**
		 * @type: Object<function>
		 * Объект callback функций события регистрации
		 * @param {object} data - json ответ sendForm
		 * @param {object} jqXHR - jquery XHR объект
		 * @param {object} params - параметры ajax запроса
		 **/
		register: {
			// Успешная регистрация (включая коды 0, 1, 3, 5, 6)
			done: function (data, jqXHR, params) { },
			// Не удачная регистрация
			fail: function (data, jqXHR, params) { },
			// Сработает во всех случаях
			always: function (data, jqXHR, params) { }
		},

		/**
		 * @type: Function
		 * Callback фунция ответа geoip
		 * @param {string} data - ответ geoip, код странны в uppercase
		 * @param {object} jqXHR - jQuery XHR объект
		 * @param {object} params - параметры ajax запроса
		 **/
		geoip: function (data, jqXHR, params) { },

		/**
		 * @type: Object<string|array<string>>
		 * Объект путей к файлам плагина
		 **/
		files: {
			translate: '{url:first}/{remotePath}/translate.js',
			config: [
				'{path}/files/{language}/config.js',
				'{url:first}/{remotePath}/files/{language}/config.js'
			],
			form: [
				'{url:first}/{remotePath}/autoform.min.js'
			],
			modules: {
				utils: '{url:first}/{remotePath}/modules/utils.js',
				intlTelInput: '{url:first}/{remotePath}/modules/intlTelInput.js',
				parallax: '{url:first}/{remotePath}/modules/parallax.js',
				styles: '{path}/FormJS.css',
				risk: '{url:first}/{remotePath}/files/{language}/risk.txt',
				terms: '{url:first}/{remotePath}/files/{language}/terms.html',
				congrats: '{url:first}/{remotePath}/files/{language}/congrats.html',
				payment: '{url:first}/{remotePath}/files/{language}/payment.html',
				logotype: '{url:first}/{remotePath}/files/{language}/logotype.html',
				exitpopup: '{url:first}/{remotePath}/files/{language}/ep.html',
				waitpopup: '{url:first}/{remotePath}/files/{language}/wp.html',
				cookie: '{url:first}/{remotePath}/files/{language}/cookie.html',
				pushmaze: {
					js: '{url:push}pushmaze_nonjq.js',
					messaging: '{url:first}/{remotePath}/modules/firebase-messaging-sw.js',
					template: {
						safari: '{url:first}/{remotePath}/modules/pushmaze/safari.html',
						material: '{url:first}/{remotePath}/modules/pushmaze/material.html',
						check: '{url:first}/{remotePath}/modules/pushmaze/check.html'
					}
				},
				saleagent: {
					html: '{url:first}/{remotePath}/files/{language}/saleagent.html',
					json: '{url:first}/{remotePath}/files/{language}/saleagent.json'
				},
				bootstrap: {
					js: '{url:first}/{remotePath}/modules/bootstrap/bootstrap.modal.js',
					css: '{url:first}/{remotePath}/modules/bootstrap/bootstrap.modal.css'
				},
				owlCarousel: {
					js: '{url:first}/{remotePath}/modules/owlCarousel/owl.carousel.js',
					css: '{url:first}/{remotePath}/modules/owlCarousel/owl.carousel.css'
				}
			}
		}
	};

	/**
	 * @type: Object
	 * Объект приватных свойств для использования в коде инициализации
	 **/
	var general = {
		$document: $(document),
		$body: $(document.body),
		$head: $(document.head),
		$form: $(),
		inputEvent: 'input',
		template: {},
		Form: {},
		Config: {},
		iframeCookie: {},
		$style: $('style[data-file]'),
		apply: null,
		selector: {
			cookie: '#cookie-bar',
			logotype: '.owl-form-logotype',
			payment: '.owl-payment',
			form: 'form.form-container',
			congrats: '.congrats',
			saleagent: '.saleagent',
			parallax: '#parallax',
			terms: {
				container: '.terms',
				use: '.terms--use',
				policy: '.terms--policy',
				cookie: '.terms--cookie'
			},
			exitpopup: '.exitpopup',
			waitpopup: '.waitpopup'
		},
		cookie: {
			name: 'cookies-state',
			value: 'accepted'
		},
		is: {
			bootstrap: !!$().modal,
			owlCarousel: !!$().owlCarousel,
			intlTelInput: !!$().intlTelInput,
			utils: !!window.intlTelInputUtils,
			parallax: !!window.Parallax,
			pushmaze: !!window._pmq
		},
		catch: {
			send: 'sendForm',
			geoip: 'geoip',
			code: 'code',
			phone: 'check/phone'
		},
		promise: {
			init: getPromise(),
			config: getPromise(),
			form: getPromise(),
			firstneed: getPromise(),
			include: getPromise(),
			terms: getPromise(),
			congrats: getPromise(),
			custom: getPromise(),
			risk: getPromise(),
			logotype: getPromise(),
			geoip: getPromise(),
			payment: getPromise(),
			exitpopup: getPromise(),
			cookie: getPromise(),
			waitpopup: getPromise(),
			saleagent: getPromise(),
			pushmaze: getPromise()
		}
	};

	/** Объект уникальных флагов (для публичных методов $.FormJS('methods')) */
	var flags = {};

	/**
	 * Инициализация плагина
	 * @returns {object} $.Deferred() объект, promise готовности плагина
	 **/
	$.extend(createObjectWithKey(plugin.name, function (options) {
		if (typeof options === 'string') return publicMethods.apply(general.apply, arguments);

		var setting = createSetting(defaults, options, plugin.data.setting, function (setting) {
			setting.language = setting.language.toLowerCase();
			window.lang = setting.language.toLowerCase();

			for (var link in setting.external) {
				try {
					setting.external[link] = atob(setting.external[link]);
				} catch (error) {}
			}

			general.template = $.extend({}, {
				language: setting.language,
				path: setting.path,
				remotePath: setting.remotePath,
				base: window.location.origin,
				domain: document.domain,
				color: setting.color,
			}, setting.template, setting.external);

			setting.files.translate = options && options.files && options.files.translate ?
				templateLink(options.files.translate) :
				templateLink(setting.files.translate);

			setting.files.config = options && options.files && options.files.config ?
				templateLink(options.files.config) :
				templateLink(setting.files.config);

			setting.files.form = options && options.files && options.files.form ?
				templateLink(options.files.form) :
				templateLink(setting.files.form);

			if (options && options.files && options.files.modules) {
				eachObject(options.files.modules, function (item, key) {
					options.files.modules[key] = templateLink(item);
				});
			} else {
				eachObject(setting.files.modules, function (item, key) {
					setting.files.modules[key] = templateLink(item);
				});
			}
		});
		
		plugin = createSetting(null, plugin, plugin.data.plugin, function (plugin) {
			plugin.ajax.setup = $.extend({}, plugin.ajax.setup, {
				ifModified: setting.cache,
				cache: setting.cache
			});
		});

		general = createSetting(null, general, plugin.data.general, function (general) {
			general.is.owlCarousel = !(setting.logotype !== false || setting.payment !== false) && !$().owlCarousel;
		});

		checkIsProduction();

		/**
		 * Запуск всех модулей, старт плагина
		 * @returns {object} $.Deferred() объект, promise
		 **/
		moduleFistInclude().done(function () {
			$.when(
				moduleInclude(),
				moduleTerms()
			).done(function () {
				moduleCongrats().done(function () {
					moduleThankU();
					moduleRegister();
					moduleCookie();
					moduleSaleAgent();
					var params = [setting, general, plugin];
					triggerEvent.apply(general.apply, $.merge([plugin.event.ready], params));
					general.promise.init.resolve.apply(general.apply, params);
				});
			});
		});

		/**
		 * @module
		 * Модуль создание кнопки "Показать другие" в плагине intlTelInput
		 * @returns {object} - $.Deferred объект, promise
		 **/
		function modulePreferredCountryList() {
			var setup = {
				list: 'ul.country-list',
				items: 'ul.country-list > li.country',
				preferredClass: 'preferred',
				translate: {
					ar: 'عرض أخرى',
					de: 'Andere anzeigen',
					dk: 'Vis andet',
					en: 'Show other',
					es: 'Mostrar otra',
					fl: 'Näytä muut',
					fr: 'Montrer autre',
					it: 'Mostra altro',
					no: 'Vis andre',
					pt: 'Mostrar outro',
					ru: 'Показать другие',
					se: 'Visa andra'
				},
				styles: '.country-open-more{display:block;width:100%;border-radius:0;background-color:#eee;color:#000;border:none;padding:10px 0;font-size:14px;margin-top:-5px;outline:0}#country-listbox{overflow-y:auto}',
				finded: false,
				appended: false,
				button: function (content) {
					return '<button type="button" data-preferred-button class="country-open-more">' + content + '</button>';
				}
			};

			if (setting.setup && setting.setup.preferred) setup = $.extend(true, {}, setup, setting.setup.preferred);

			var currentLocaleText = setup.translate[setting.language];

			general.promise.geoip.done(function (country) {
				var $items = $(setup.items, general.$form);
				var $list = $(setup.list);
				if (!setting.preferred || !$items.hasClass(setup.preferredClass)) {
					return false;
				}

				$.each($items, function () {
					if (!setup.finded && $(this).attr('data-country-code') === country.toLowerCase()) {
						$list.prepend($(this).clone(true).addClass(setup.preferredClass));
						$(this).remove();
						setup.finded = true;
					}
					if (!$(this).hasClass(setup.preferredClass)) {
						$(this).hide();
					}
				});

				var $button = $list.find('li.divider').after(setup.button(currentLocaleText)).siblings('button[data-preferred-button]');

				$button.on('click touch', function (event) {
					event.preventDefault();
					event.stopPropagation();
					$(setup.items).show();
					$button.hide();
				});

				$.each(general.$style, function () {
					var src = $(this).attr('data-src');
					if (src && src.length && src.includes('FormJS.css')) {
						$(this).append(setup.styles);
						setup.appended = true;
					}
				});

				if (!setup.appended) general.$head.append('<style>' + setup.styles + '</style>');
			});
		}

		/**
		 * @module
		 * Модуль модального окна после регистрации SaleAgent
		 * @returns {object} - $.Deferred объект, promise
		 **/
		function moduleSaleAgent() {
			if (setting.saleagent === false || !setting.files.modules.saleagent.html || !setting.files.modules.saleagent.json || !general.Config.enableAgentGenderSelector || !general.Form.sendWithPopup) {
				return general.promise.saleagent.resolve();
			}

			var initSaleAgent = function (html) {
				if (html) general.$body.append(html);
				moduleSaleAgentEvent();
				return general.promise.saleagent.resolve();
			};

			if (verifyHTML(general.selector.saleagent)) {
				initSaleAgent();
			} else {
				getSaleAgent().done(function (user) {
					var region = getCommonCountryRegion();
					ajax(setting.files.modules.saleagent.html, {
						dataFilter: function (html) {
							return tag(html, $.extend({}, general.template, {
								WomanName: user.woman.name,
								WomanPhoto: tag(setting.saleagent.photo.template, $.extend({}, general.template, {
									index: getRandom.apply(null, setting.saleagent.photo.range.woman),
									gender: 'woman',
									region: region
								})),
								ManName: user.man.name,
								ManPhoto: tag(setting.saleagent.photo.template, $.extend({}, general.template, {
									index: getRandom.apply(null, setting.saleagent.photo.range.man),
									gender: 'man',
									region: region
								}))
							}));
						}
					}).done(initSaleAgent);
				});
			}

			return general.promise.saleagent;
		}

		/**
		 * Получить регион по стране
		 * @param {string} lang - язык, например: de, dk, en ...
		 * @returns {string} - регион: eu (Европа), cis (СНГ), ar (арабы)
		 **/
		function getCommonCountryRegion(lang) {
			switch (lang || setting.language) {
				case 'de':
				case 'dk':
				case 'en':
				case 'es':
				case 'fl':
				case 'fr':
				case 'it':
				case 'no':
				case 'pt':
				case 'se':
					return 'eu';
				case 'ru':
					return 'cis'
				case 'ar':
					return 'ar';
				default:
					return 'eu';
			}
		}

		/**
		 * Обработка события SaleAgent модуля
		 **/
		function moduleSaleAgentEvent() {
			var setup = {
				animation: 300,
				methods: {
					open: function (callback) {
						$(general.selector.saleagent).fadeIn(setup.animation, callback);
						triggerEvent(plugin.event.saleagent.open);
					},
					close: function (callback) {
						$(general.selector.saleagent).fadeOut(setup.animation, callback);
						triggerEvent(plugin.event.saleagent.close);
					}
				}
			};

			if (setting.setup && setting.setup.saleagent) setup = $.extend(true, {}, setup, setting.setup.saleagent);

			createSetting(null, setup.methods, plugin.data.saleagent);

			general.$document.on('ajaxComplete', function (event, jqXHR, params) {
				if (params && params.url && params.url.includes(general.catch.send)) {
					setup.methods.close();
				}
			});

			$('[data-choose]', general.selector.saleagent).on('click touch', function (event) {
				event.preventDefault();
				var gender = $(this).attr('data-choose');
				if (!general.Form.sendWithPopup) return;
				triggerEvent(plugin.event.saleagent.send, gender);
				general.Form.sendWithPopup.call(general.Form, gender);
			});
		}

		/**
		 * Получить случайную пару sale агентов: { woman: { name, surname }, man: { name, surname } }
		 * @returns {object} - $.Deferred объект, promise
		 **/
		function getSaleAgent() {
			return ajax(setting.files.modules.saleagent.json, {
				dataType: 'json',
				dataFilter: function (response) {
					var data = JSON.parse(response);
					return JSON.stringify({
						woman: getRandomSaleAgent(data.woman, 'woman'),
						man: getRandomSaleAgent(data.man, 'man')
					});
				}
			});
		}

		/**
		 * Получить случайный объект из массива SaleAgent'ов
		 * @param {array} list - массив объектов агентов
		 * @param {string} gender - стать: woman, man
		 * @returns {object} - случайный объект агента
		 **/
		function getRandomSaleAgent(list, gender) {
			var random = getRandom.apply(null, setting.saleagent.agent.range[gender]);
			return list[random] ? list[random] : getRandomSaleAgent(list, gender);
		}

		/**
		 * @module
		 * Модуль показа блока Cookie
		 * @returns {object} - $.Deferred объект, promise
		 **/
		function moduleCookie() {
			if (!setting.cookie || !setting.files.modules.cookie || cookie(general.cookie.name).get()) {
				return general.promise.cookie.resolve();
			}

			var setup = $.extend({}, {
				page: function () {
					publicCall(plugin.data.terms).open('cookie');
				},
				position: 'bottom',
				animation: {
					duration: 300,
					show: 'slideDown',
					hide: 'slideUp'
				}
			}, setting.cookie === true ? {} : setting.cookie);

			var template = $.extend({}, general.template, (function (params) {
				if (typeof setup.page === 'string') params.page = setup.page;
				params.position = setup.position;
				return params;
			})({}));

			ajax(setting.files.modules.cookie, {
				dataFilter: function (html) {
					return tag(html, template);
				},
				success: function (html) {
					var offset = setup.position === 'bottom' ? '<div id="cookie-bar-offset"></div>' : '';
					$('body').append(offset + html);
					moduleCookieEvent(setup, $(general.selector.cookie, document.body), $('#cookie-bar-offset', document.body));
					return general.promise.cookie.resolve();
				}
			});

			return general.promise.cookie;
		}

		/**
		 * @module
		 * Модуль обработки события Cookie
		 * @params {object} setup - объект параметров модуля
		 * @param {jQuerySelector} $cookie - jQuery эелемент контейнера cookie
		 * @param {jQuerySelector} $offset - jQuery элемент блока offset
		 **/
		function moduleCookieEvent(setup, $cookie, $offset) {
			var margin = function () {
				$offset.css('height', $cookie.height() + 'px');
			};

			$cookie[setup.animation.show](setup.animation.duration, function () {
				if (setup.position === 'bottom') margin();
			});

			if (setup.position === 'bottom') $(window).on('resize', margin);

			$('[data-cookie-accept]', $cookie).on('click touch', function (event) {
				event.preventDefault();
				cookie(general.cookie.name).set(general.cookie.value);
				$.merge($offset, $cookie)[setup.animation.hide](setup.animation.duration);
			});

			if (typeof setup.page === 'function') {
				var $button = $('[data-cookie-more]', $cookie);
				if ($button.attr('href')) $button.attr('href', '#').removeAttr('target');
				$button.on('click touch', function (event) {
					event.preventDefault();
					setup.page.call(this);
				});
			}
		}

		/**
		 * Работа с Cookie
		 * @params {string} cname - название ключа
		 * @params {string} cvalue - значение ключа
		 * @returns {string} - значение
		 **/
		function cookie(cname) {
			return {
				get: function () {
					var name = cname + "=";
					var ca = document.cookie.split(';');
					for (var i = 0; i < ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0) === ' ') {
							c = c.substring(1);
						}
						if (c.indexOf(name) === 0) {
							return decodeURIComponent(c.substring(name.length, c.length));
						}
					}
					return '';
				},
				set: function (cvalue, exdays, cpath) {
					if (!exdays) exdays = 365;
					if (!cpath) cpath = '/';
					var d = new Date();
					d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
					var expires = 'expires=' + d.toUTCString();
					document.cookie = cname + '=' + encodeURIComponent(cvalue) + ";" + expires + ";path=" + cpath;
					return cvalue;
				}
			};
		}

		/**
		 * @module
		 * Модуль вставки файлов первой необходимости
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleFistInclude() {
			var script = [];
			if (setting.files.translate !== false) script.push(setting.files.translate);
			if (setting.files.config !== false) script.push(setting.files.config);
			if (!general.is.intlTelInput && setting.files.modules.intlTelInput) script.push(setting.files.modules.intlTelInput);
			if (!general.is.utils && setting.files.modules.utils) script.push(setting.files.modules.utils);
			if (!general.is.owlCarousel && setting.files.modules.owlCarousel) script.push(setting.files.modules.owlCarousel.js);

			var style = [];

			if (!verifyCSS('div', {
				class: plugin.test.formCSS,
				text: ' '
			}, function ($selector) {
				return $selector.width() && $selector.height();
			}) && setting.files.modules.styles) {
				style.push(setting.files.modules.styles);
			}

			if (!general.is.bootstrap && setting.bootstrap !== false && setting.files.modules.bootstrap) style.push(setting.files.modules.bootstrap.css);

			$.when(
				includeStyle(style),
				includeScript(script)
			).done(function () {
				general.Config = window.CONFIG;
				general.promise.config.resolve();
				$.when(moduleExitPopup(), moduleWaitPopup()).done(function () {
					ajaxCatchPromise(general.catch.geoip, general.promise.geoip).then(function (data, params, jqXHR) {
						var data = [data, jqXHR, params];
						setting.geoip.apply(this, data);
						triggerEvent.apply(general.apply, $.merge([plugin.event.geoip], data));
					});
					moduleForm().done(function () {
						general.Form = window.Form;
						general.$form = $(general.selector.form);
						general.promise.form.resolve();
						moduleInputBinding();
						moduleUrlCatch();
						moduleInputSave();
						moduleLogotype();
						modulePayment();
						moduleMissed();
						moduleRisk();
						general.promise.firstneed.resolve();
					});
				});
			});

			return general.promise.firstneed;
		}

		/**
		 * @module
		 * Модуль сохранения содержимого полей формы в Cookie
		 **/
		function moduleInputSave() {
			if (!setting.saveinput) return false;

			var init = true;

			var saved = {};

			setIframeCookie();

			var $input = general.$form.find('input[required]:not([name="code"]):not([type="checkbox"]):not([type="hidden"])');
			var validation = general.Form.check_validation.bind(general.Form);

			getIframeCookie(function (data) {
				if (init) {
					general.iframeCookie = data;
					saved = $.extend({}, data, saved);
					$.each($input, function () {
						var name = $(this).attr('name');
						$(this).val(general.iframeCookie[name]);
						validation($(this));
						if (name === 'phone') $(this).trigger('input');
					});
					init = false;
				}
			}, 'base64');

			general.$document.on('ajaxComplete', function (event, jqXHR, params) {
				if (params && params.url && params.url.includes(general.catch.phone)) {
					jqXHR.always(function (response) {
						if (!response) return;
						var data = JSON.parse(response);
						if (data.success) {
							var phone = JSON.parse(params.data).phone.replace('+' + general.Form.telInput.intlTelInput('getSelectedCountryData').dialCode, '');
							saved.phone = phone;
							setIframeCookie(saved);
						}
					});
				}
			});

			$input.on('input', debounce(function () {
				var name = $(this).attr('name');
				if (name === 'phone') return;
				if ($(this).hasClass('valid')) saved[name] = $(this).val();
				setIframeCookie(saved);
			}, 200));
		}

		/**
		 * Задержка перед действием
		 * @param {function} func - функция действия
		 * @param {number} wait - продолжительность задержки в миллисекундах
		 * @returns {function} - фукнция, кторая выполнится после заданной задержки
		 **/
		function debounce(func, wait) {
			var timeout;
			return function () {
				var context = this,
					args = arguments;
				var later = function () {
					timeout = null;
					func.apply(context, args);
				};
				var callNow = !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		}

		/**
		 * Вставить iFrame на страницу, передать данные для записи в cookie
		 * @param {object} data - данные формы: { firstname, lastname, email, phone }
		 * @returns {jQuery Selector} - jQuery эелемент iFrame
		 **/
		function setIframeCookie(data) {
			var $iframe = $('#iframe-cookie', general.$body);
			if ($iframe.length) $iframe.remove();
			var params = {
				origin: window.location.origin
			};
			if (data) params.FormJS = btoa(JSON.stringify(data));
			params = $.param(params);
			general.$body.append(tag('<iframe id="iframe-cookie" style="display:none;" src="{url:first}/FormJSWrap/cookie.html?' + params + '" frameborder="0"></iframe>', general.template));
			return $('#iframe-cookie', general.$body);
		}

		/**
		 * Обработчик сообщений из iFrame Cookie. Получить данные из iFrame
		 * @param {function} callback - данные из iFrame
		 * @param {string} charset - кодировка
		 * @returns {undefined}
		 **/
		function getIframeCookie(callback, charset) {
			window.addEventListener('message', function (event) {
				if (event.origin === tag('{url:first}', general.template)) {
					if (charset) {
						switch (charset) {
							case 'base64':
								var data = atob(event.data);
								try {
									data = JSON.parse(data);
								} catch (error) { }
								return callback(data);
						}
					} else {
						callback(event.data);
					}
				}
			}, false);
		}

		/**
		 * @module
		 * Модуль вывода текста Предупреждения о риске
		 * @returns {object} - $.Deferred объект, promise
		 **/
		function moduleRisk() {
			if (!setting.risk || !setting.files.modules.risk) {
				return general.promise.risk.resolve();
			}
			ajax(setting.files.modules.risk).done(function (text) {
				switch (typeof setting.risk) {
					case 'string':
						$(setting.risk).append(text);
						break;
					case 'function':
						setting.risk(text);
						break;
				}
				general.promise.risk.resolve();
			});
			return general.promise.risk;
		}

		/**
		 * @module
		 * Модуль перехвата события регистрации
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleRegister() {
			var parseData = function (jqXHR) {
				try {
					if (jqXHR.responseText) {
						var json = JSON.parse(jqXHR.responseText);
						return typeof json === 'object' ? json : JSON.parse(json);
					} else {
						return jqXHR.response || {};
					}
				} catch (error) {
					return jqXHR.responseText || {};
				}
			};
			general.$document.on('ajaxComplete', function (event, jqXHR, params) {
				if (params && params.url && params.url.includes(general.catch.send)) {
					params.data = (function () {
						try {
							return JSON.parse(params.data);
						} catch (error) {
							return params.data;
						}
					}());
					var args = [parseData(jqXHR), jqXHR, params];
					jqXHR.done(function () {
						setting.register.done.apply(this, args);
						triggerEvent.apply(general.apply, $.merge([plugin.event.register.done], args));
					}).fail(function () {
						var code = typeof args[0] === 'object' ? args[0].code : null;
						if ([0, 1, 3, 5, 6].includes(code)) {
							setting.register.done.apply(this, args);
							triggerEvent.apply(general.apply, $.merge([plugin.event.register.done], args));
						} else {
							setting.register.fail.apply(this, args);
							triggerEvent.apply(general.apply, $.merge([plugin.event.register.fail], args));
						}
					}).always(function () {
						setting.register.always.apply(this, args);
						triggerEvent.apply(general.apply, $.merge([plugin.event.register.always], args));
					});
				}
			});
		}

		function catchAjaxSendForm(proccess) {
			var parseData = function (jqXHR) {
				try {
					if (jqXHR.responseText) {
						var json = JSON.parse(jqXHR.responseText);
						return typeof json === 'object' ? json : JSON.parse(json);
					} else {
						return jqXHR.responseText || {};
					}
				} catch (error) {
					return jqXHR.responseText || {};
				}
			};
			general.$document.on('ajaxComplete', function (event, jqXHR, params) {
				if (params && params.url && params.url.includes(general.catch.send)) {
					params.data = (function () {
						try {
							return JSON.parse(params.data);
						} catch (error) {
							return params.data;
						}
					}());
					var args = [parseData(jqXHR), jqXHR, params];
					jqXHR.done(function () {
						proccess.done && proccess.done.apply(this, args);
					}).fail(function () {
						var code = typeof args[0] === 'object' ? args[0].code : null;
						if ([0, 1, 3, 5, 6].includes(code)) {
							proccess.done && proccess.done.apply(this, args);
						} else {
							proccess.fail && proccess.fail.apply(this, args);
						}
					}).always(function () {
						proccess.always && proccess.always.apply(this, args);
					});
				}
			});
		}

		/**
		 * @module
		 * Модуль чтения GET параметров URL для двухстраничных форм
		 **/
		function moduleUrlCatch() {
			if (setting.urlcatch === false || !window.location.search) return false;
			var link = new URL(window.location.href);
			
			$.each(general.$form, function () {
				$.each($('input[type!="hidden"]', this), function () {
					var param = link.searchParams.get($(this).attr('name'));
					if (param) $(this).val(param).trigger(general.inputEvent);
				});
			});
		}

		/**
		 * @module
		 * Модуль редиректа на странцу ThankU, вместо Congrats
		 **/
		function moduleThankU() {
			if (setting.thanku === false) return false;
			window.congrats = function () { };

			var parseData = function (jqXHR) {
				try {
					if (jqXHR.responseText) {
						var json = JSON.parse(jqXHR.responseText);
						return typeof json === 'object' ? json : JSON.parse(json);
					} else {
						return jqXHR.responseText || {};
					}
				} catch (error) {
					return jqXHR.responseText || {};
				}
			};

			general.$document.on('ajaxComplete', function (event, jqXHR, params) {
				if (params && params.url && params.url.includes(general.catch.send)) {
					params.data = (function () {
						try {
							return JSON.parse(params.data);
						} catch (error) {
							return params.data;
						}
					}());
					var args = [parseData(jqXHR), jqXHR, params];
					jqXHR.always(function () {
						var data = typeof args[0] === 'object' ? args[0] : null;
						if (![0, 1, 3, 5, 6].includes(data.code)) return false;
						var link = encodeURIComponent(data.message);
							switch (typeof setting.thanku) {
								case 'string':
									return window.location.href = tag(setting.thanku, $.extend({}, general.template, {
										param: 'link=' + link,
										name: 'link',
										link: link
									}));
								case 'function':
									return setting.thanku(link);
							}
					});
				}
			});
		}

		/**
		 * @module
		 * Модуль двухсторонней привязки форм
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleInputBinding() {
			if (setting.binding === false || general.$form.length <= 1) return false;
			var text = 'input[type!="hidden"][name!="phone"]';
			var checkbox = 'input[type="checkbox"]';
			var phone = 'input[name="phone"]';
			var code = 'input[name="code"]';
			var $code = $(code, general.$form);
			var validation = general.Form.check_validation.bind(general.Form);

			var attr = function (attr, value) {
				return '[' + attr + '="' + value + '"]';
			};

			$.each(general.$form, function () {
				var form = this;
				$(text, form).on(general.inputEvent, function () {
					var $input = general.$form.not(form).find(text + attr('name', $(this).attr('name')));
					$input.val($(this).val());
					validation($input);
				});
				$(phone, form).on(general.inputEvent, function () {
					var $phone = general.$form.not(form).find(phone);
					$phone.val($(this).val());
					setTimeout(function () {
						validation($(phone, general.$form));
					});
				});
				$(checkbox, form).on('change', function () {
					var $checkbox = general.$form.not(form).find(checkbox + attr('name', $(this).attr('name')));
					$checkbox.prop('checked', $(this).prop('checked'));
					validation($checkbox);
				});
			});

			$code.on(general.inputEvent, function () {
				$code.not(this).val($(this).val());
			});

			ajaxCatchUp(general.catch.code).done(function (response) {
				var data = JSON.parse(response);
				if (data.success === true) {
					general.Form.validation($code);
					$code.attr('disabled', true);
				} else {
					general.Form.invalidInput($code, 'code');
				}
			}).fail(function () {
				general.Form.invalidInput($code, 'code');
			});

			general.promise.geoip.then(function () {
				var $phone = $(phone, general.$form);
				$phone.on('countrychange', function () {
					validation($phone);
				});
			});
		}

		/**
		 * @module
		 * Обработчик модуля Missed Click
		 **/
		function moduleMissed() {
			var setup = {
				// Тригер-атрибут модуля
				missed: 'data-missed',

				// События срабатывания
				event: 'click touch',

				// Зона кликабельности
				area: 20,

				// Метод по умолчанию
				action: 'exitpopup'
			};

			if (setting.setup && setting.setup.missed) setup = $.extend({}, setup, setting.setup.missed);

			var coord = function ($element, event, type) {
				if (type === 'absolute') {
					return {
						x: event.pageX,
						y: event.pageY
					};
				} else if (type === 'relative') {
					var box = $element.get(0).getBoundingClientRect();
					return {
						x: box.left + pageXOffset,
						y: box.top + pageYOffset
					};
				}
			};

			var methods = $.extend({}, {
				exitpopup: function () {
					return publicCall(plugin.data.exitpopup).open();
				}
			}, setting.missed === true ? {} : setting.missed);

			general.$document.on(setup.event, function (event) {
				var $target = $(event.target);

				if ($target.is('[' + setup.missed + ']')) return false;

				var click = coord($target, event, 'absolute');

				var data = (function () {
					var items = [];
					$.each($('[' + setup.missed + ']'), function () {
						var $element = $(this);
						items.push($.extend({}, coord($element, event, 'relative'), {
							native: this,
							element: $element,
							width: $element.width(),
							height: $element.height(),
							setting: $element.data('setting') || {}
						}));
					});
					return items;
				})();

				eachObject(data, function (box, item) {
					var params = $.extend({}, setup, box.setting);

					var x = click.x >= box.x - setup.area && click.x <= box.x + box.width + setup.area;
					var y = click.y >= box.y - setup.area && click.y <= box.y + box.width + setup.area;

					if (x && y) {
						var action = box.element.attr(setup.missed) || params.action;
						if (!action) action = setup.action;
						if (methods[action]) methods[action].call(box.native);
					}
				});
			});
		}

		/**
		 * Вызов публичных методов
		 * @param {string} method - название метода
		 * @returns {any}
		 **/
		function publicCall(method) {
			return $[plugin.name](method);
		}

		/**
		 * Перехватить ajax запрос и разрешить переданный промис
		 * @param {string} endpoint - путь ajax запроса
		 * @param {object} promise - $.Deferred объект
		 * @returns {object} - разрешённый переданный промис
		 **/
		function ajaxCatchPromise(endpoint, promise) {
			ajaxCatchUp(endpoint).done(promise.resolve).fail(promise.reject);
			return promise;
		}

		/**
		 * Перехват глобальных ajax запросов
		 * @params {function} success - обработчик успеха
		 * @params {function} error - обработчик ошибки
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function ajaxCatchUp(endpoint, success, error) {
			var promise = getPromise();
			general.$document.on('ajaxComplete', function (event, jqXHR, params) {
				if (params && params.url && params.url.includes(endpoint)) {
					jqXHR.done(function (response) {
						var args = [response, this, event];
						if (success) success.apply(general.apply, args);
						return promise.resolve.apply(general.apply, args);
					}).fail(function () {
						var args = $.merge([this], arguments, [event]);
						if (error) error.apply(general.apply, args);
						return promise.reject.apply(general.apply, args);
					});
				}
			});
			return promise;
		}

		/**
		 * Проверить в каком окружении используется форма: dev или prod
		 */
		 function checkIsProduction() {
			if (
				stringStartsWith(window.location.host, '127.0') ||
				stringStartsWith(window.location.host, '192.168') ||
				stringStartsWith(window.location.host, 'localhost') ||
				window.location.host.includes('dev.')
			) {
				general.promise.config.done(function () {
					(function checkConfigTrackers(isDevCallback, isProdCallback) {
						var prodConfigKeywords = ['fbq', 'lead', 'pixel', 'matomo', 'piwik', 'ga', 'ym', 'ttq'];

						if ((window.fbq || window.dataLayer || window._paq || window.ga || window.ym || window.ttq) && typeof isDevCallback === 'function') {
							if (window.fbq) {
								window.fbq = function () {};
							}

							if (window.ym) {
								window.ym = function () {};
							}

							if (window.ttq) {
								window.ttq = function () {};
							}

							if (window.ga) {
								window.ga = function () {};
							}

							if (window.dataLayer) {
								window.dataLayer = {
									push: function () {}
								};
							}

							if (window._paq) {
								window._paq = {
									push: function () {}
								};
							}

							return isDevCallback();
						}

						if(general.Config.externalTrackers) {
							for (var i = 0; i < general.Config.externalTrackers.length; i++) {
								var tracker = general.Config.externalTrackers[i];
								var code = tracker.code.toLowerCase();
								if (prodConfigKeywords.some(function (substr) {
									return code.includes(substr);
								}) && typeof isDevCallback === 'function') {
									return isDevCallback();
								}
							}
						}

						if(general.Config.externalTrackerEvents) {
							for (var i = 0; i < general.Config.externalTrackerEvents.length; i++) {
								var events = general.Config.externalTrackerEvents[i];
								var code = events.code.toLowerCase();
								if (prodConfigKeywords.some(function (substr) {
									return code.includes(substr);
								}) && typeof isDevCallback === 'function') {
									return isDevCallback();
								}
							}
						}

						if(general.Config.trackersTemplates) {
							for (var i = 0; i < general.Config.trackersTemplates.length; i++) {
								var tracker = general.Config.trackersTemplates[i];
								var events = tracker.events;
								for (var subIndex = 0; subIndex < events.length; subIndex++) {
									var code = events[subIndex].code.toLowerCase();
									if (prodConfigKeywords.some(function (substr) {
										return code.includes(substr);
									}) && typeof isDevCallback === 'function') {
										return isDevCallback();
									}
								}
							}
						}

						if (typeof isProdCallback === 'function') {
							isProdCallback();
						}
					})(function () {
						window.CONFIG = general.Config = $.extend(true, {}, general.Config, {
							externalTrackers: [{
								position: 'head',
								code: "console.log('head')"
							}, {
								position: 'body',
								code: "console.log('body')"
							}],
							externalTrackerEvents: [{
								event: 'load',
								code: "console.log('load event')"
							}, {
								event: 'registration',
								code: "console.log('registration event')"
							}],
							trackersTemplates: [{
								"name": "facebook",
								"enabled": false,
							},
							{
								"name": "google",
								"enabled": false,
							},
							{
								"name": "yandex",
								"enabled": false,
							},
							{
								"name": "tiktok",
								"enabled": false,
							}]
						});
						return message('Forbidden use CRM trackers in Config.js file on localhost or developer server! Config.js trackers did replaced on defaults events automatically');
					});
				});
			}
		}

		/**
		 * @module
		 * Инициализация карусели логотипов под формой
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleLogotype() {
			if (!setting.logotype || !setting.files.modules.logotype) return general.promise.logotype.resolve();

			var initLogotype = function (html) {
				var $selector = {};
				var params = {};
				var owl = general.selector.logotype;

				if (setting.logotype === true) {
					$selector = html ? general.$form.after(html).next(owl) : $(owl);
				} else {
					switch (typeof setting.logotype) {
						case 'object':
							params = setting.logotype;
							$selector = html ? general.$form.after(html).next(owl) : $(owl);
							break;
						case 'function':
							params = setting.logotype.call(general.$form.get(), $(html)) || {};
							$selector = $(owl);
							break;
						case 'string':
							$selector = html ? $(setting.logotype).append(html).find(owl) : $(owl);
							break;
					}
				}

				if (setting.language === 'ar') params.rtl = true;

				$selector.owlCarousel($.extend(true, {}, {
					loop: true,
					dots: false,
					autoplay: true,
					autoplayTimeout: 4000,
					autoplaySpeed: 1500,
					responsive: {
						0: {
							items: 1
						},
						375: {
							items: 2
						},
						680: {
							items: 3
						}
					}
				}, params));

				return general.promise.logotype.resolve();
			};

			verifyHTML(general.selector.logotype) ?
				initLogotype() :
				ajax(setting.files.modules.logotype).done(initLogotype);

			return general.promise.logotype;
		}

		/**
		 * @module
		 * Инициализация карусели платежных логотипов
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function modulePayment() {
			if (!setting.payment || !setting.files.modules.payment) return general.promise.payment.resolve();

			var initPayment = function (html) {
				var $selector = {};
				var params = {};
				var owl = general.selector.payment;

				if (setting.payment === true) {
					$selector = html ? general.$body.append(html).find(owl) : $(owl);
				} else {
					switch (typeof setting.payment) {
						case 'object':
							params = setting.payment;
							$selector = html ? general.$body.append(html).find(owl) : $(owl);
							break;
						case 'function':
							params = setting.payment($(html)) || {};
							$selector = $(owl);
							break;
						case 'string':
							$selector = html ? $(setting.payment).append(html).find(owl) : $(owl);
							break;
					}
				}

				if (setting.language === 'ar') params.rtl = true;

				$selector.owlCarousel($.extend(true, {}, {
					loop: true,
					nav: false,
					dots: false,
					autoplay: true,
					autoplayTimeout: 4000,
					autoplaySpeed: 1500,
					responsive: {
						0: {
							items: 3
						},
						480: {
							items: 4
						},
						680: {
							items: 5
						},
						991: {
							items: 6
						},
						1200: {
							items: 7
						}
					}
				}, params));
				general.promise.payment.resolve();
			};

			verifyHTML(general.selector.payment) ?
				initPayment() :
				ajax(setting.files.modules.payment).done(initPayment);

			return general.promise.payment;
		}

		/**
		 * @module
		 * Модуль инициализации Wait Popup
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleWaitPopup() {
			if (!setting.waitpopup || !setting.files.modules.waitpopup) {
				return general.promise.waitpopup.resolve();
			}

			var initWaitpopup = function (html) {
				if (html) general.$body.append(html);
				moduleEventWait();
				return general.promise.waitpopup.resolve();
			}

			verifyHTML(general.selector.waitpopup) ?
				initWaitpopup() :
				ajax(setting.files.modules.waitpopup).done(initWaitpopup);

			return general.promise.waitpopup;
		}

		/**
		 * @module
		 * Модуль обработки событий WaitPopup
		 * @returns {undefined}
		 **/
		function moduleEventWait() {
			var waitpopup = {
				// Контейнер waitpopup окна
				popup: $('.waitpopup'),

				// Overlay waitpopup окна
				overlay: $('.waitpopup-overlay'),

				// Продолжительность анимации закрытия/открытия
				animation: 200,

				// Задержка перед проверкой показывать ли окно
				delay: 10e3,

				// События
				event: {
					// События клика
					click: 'click touch',
					// События активации слежения
					in: 'focus input',
					// События активации проверки
					out: 'blur'
				},

				// Задержка перед событиями проверки/слежения
				debounce: 1e3,

				// Эффекты анимации
				effect: ['fadeIn', 'fadeOut'],

				// Методы
				methods: {
					open: function () {
						waitpopup.popup[waitpopup.effect[0]](waitpopup.animation);
						waitpopup.overlay[waitpopup.effect[0]](waitpopup.animation);
					},
					close: function () {
						waitpopup.popup[waitpopup.effect[1]](waitpopup.animation);
						waitpopup.overlay[waitpopup.effect[1]](waitpopup.animation);
					}
				}
			};

			if (setting.setup && setting.setup.waitpopup) waitpopup = $.extend(true, {}, waitpopup, setting.setup.waitpopup);

			createSetting(null, waitpopup, plugin.data.waitpopup);

			var method = {
				wait: function (callback) {
					if (!callback) return false;
					var focused = [];
					general.$document.on(waitpopup.event.in, (general.selector.form + ' input'), debounce(function (event) {
						focused.push(setTimeout(function () {
							if (!$(document.activeElement).parents(general.selector.form).length && !(setting.files.modules.congrats && $(general.selector.congrats).is(':visible')) && !(setting.exitpopup && $(general.selector.exitpopup).is('visible'))) {
								return callback();
							}
							focused.pop();
						}, waitpopup.delay));
					}, waitpopup.debounce));
					general.$document.on(waitpopup.event.out, (general.selector.form + ' input'), debounce(function (event) {
						if (focused.length > 1) {
							focused.forEach(function (timeout, index) {
								if (focused.length !== index + 1) {
									clearTimeout(timeout);
									focused.splice(index, 1);
								}
							});
						}
					}, waitpopup.debounce));
				},
				event: function (object) {
					eachObject(object, function (value, key) {
						if (typeof value !== 'function') return;
						method[key](function () {
							value.call({
								popup: waitpopup.popup,
								overlay: waitpopup.overlay
							}, waitpopup.methods);
						});
					});
				}
			};

			method.event($.extend({}, {
				wait: function (wait) {
					wait.open();
				}
			}, setting.waitpopup === true ? {} : setting.waitpopup));

			general.$document.on(waitpopup.event.click, '[data-waitpopup-close]', function (event) {
				event.preventDefault();
				waitpopup.methods.close();
			});

		}

		/**
		 * @module
		 * Модуль инициализации Exit Popup
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleExitPopup() {
			if (!setting.exitpopup || !setting.files.modules.exitpopup) {
				return general.promise.exitpopup.resolve();
			}

			var initExitpopup = function (html) {
				if (html) general.$body.append(html);
				moduleEventExit();
				return general.promise.exitpopup.resolve();
			};

			if (verifyHTML(general.selector.exitpopup)) {
				initExitpopup();
			} else {
				ajax(setting.files.modules.exitpopup).done(initExitpopup)
			}

			return general.promise.exitpopup;
		}

		/**
		 * @module
		 * Модуль обработки событий ExitPopup
		 * @returns {undefined}
		 **/
		function moduleEventExit() {
			var exitpopup = {
				// Основной контейнер окна
				popup: $('.exitpopup'),

				// Задний фон окна
				overlay: $('.exitpopup-overlay'),

				// Продолжительность анимации в милисекундах
				animation: 200,

				// К-во секунд для показа окна по таймеру
				timer: 45e3,

				// Зона границ браузера, где будет срабатывать окно
				area: 10,

				// События
				event: {
					// Отслеживание позиции курсора мыши
					mouse: 'mousemove',
					// Кликы для закрытия окна
					click: 'click touch'
				},

				// Задержка чтения координат мыши
				delay: 100,

				// Эффект показа/закрытия окна
				// ['fadeIn', 'fadeOut'] или ['slideDown', 'slideUp']
				effect: ['fadeIn', 'fadeOut'],

				// Методы
				methods: {
					// Открыть окно
					open: function () {
						exitpopup.popup[exitpopup.effect[0]](exitpopup.animation);
						exitpopup.overlay[exitpopup.effect[0]](exitpopup.animation);
					},

					// Закрыть окно
					close: function () {
						exitpopup.popup[exitpopup.effect[1]](exitpopup.animation);
						exitpopup.overlay[exitpopup.effect[1]](exitpopup.animation);
					}
				}
			};

			if (setting.setup && setting.setup.exitpopup) exitpopup = $.extend(true, {}, exitpopup, setting.setup.exitpopup);

			createSetting(null, exitpopup, plugin.data.exitpopup);

			var checker = function (type) {
				if (setting.files.modules.congrats && $(general.selector.congrats).is(':visible')) {
					return false;
				}
				if ($(document.activeElement).parents(general.selector.form).length) {
					return false;
				}
				if ($(general.selector.terms.container).is(':visible')) {
					return false;
				}
				if ($(general.selector.waitpopup).is(':visible')) {
					return false;
				}
				return true;
			};

			var method = {
				mouse: function (callback) {
					if (!callback) return false;
					var timeout = 0;
					general.$document.on(exitpopup.event.mouse, function (event) {
						clearTimeout(timeout);
						timeout = setTimeout(function () {
							if (event.clientY < exitpopup.area || event.clientY > window.innerHeight - exitpopup.area) {
								if (checker('mouse')) {
									triggerEvent(plugin.event.exit.mouse, exitpopup);
									callback();
								}
							}
						}, exitpopup.delay);
					});
				},
				timer: function (callback) {
					if (!callback) return false;
					setTimeout(function () {
						if (checker('timer')) {
							triggerEvent(plugin.event.exit.timer, exitpopup);
							callback();
						}
						method.timer(callback);
					}, exitpopup.timer);
				},
				event: function (object) {
					eachObject(object, function (value, key) {
						if (typeof value !== 'function') return;
						method[key](function () {
							value.call({
								popup: exitpopup.popup,
								overlay: exitpopup.overlay
							}, exitpopup.methods);
						});
					});
				}
			};

			method.event($.extend({}, {
				mouse: function (exit) {
					exit.open();
				},
				timer: function (exit) {
					return false;
				}
			}, setting.exitpopup === true ? {} : setting.exitpopup));

			general.$document.on(exitpopup.event.click, '[data-exitpopup-close]', function (event) {
				event.preventDefault();
				exitpopup.methods.close();
			});
		}

		/**
		 * Функция задержки перед срабатыванием
		 * @returns {function} - функция которая выполнится после заданной задержки
		 **/
		function debounce(func, wait, immediate) {
			var timeout;
			return function () {
				var context = this;
				var args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		}

		/**
		 * @module
		 * Модуль вставки js и css файлов
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleInclude() {
			var script = [];
			if (!general.is.bootstrap && setting.bootstrap !== false && setting.files.modules.bootstrap) script.push(setting.files.modules.bootstrap.js);
			if (!general.is.parallax && setting.files.modules.parallax) script.push(setting.files.modules.parallax);

			var style = [];
			if (!general.is.owlCarousel && setting.files.modules.owlCarousel) style.push(setting.files.modules.owlCarousel.css);

			$.when(
				includeStyle(style),
				includeScript(script)
			).done(function () {
				moduleSinglePage();
				modulePreferredCountryList();
				countryListScrollTop();
				modulePushmaze();
				return general.promise.include.resolve();
			});

			return general.promise.include;
		}

		/**
		 * Модуль инициализации браузерных PUSH уведомлений PushMaze
		 */
		function modulePushmaze() {
			if (general.is.pushmaze || setting.pushmaze === false || (!setting.files.modules.pushmaze.js || !setting.files.modules.pushmaze.template || !setting.files.modules.pushmaze.messaging)) {
				return general.promise.pushmaze.resolve();
			}

			var setup = $.extend({}, {
				external: '{url:push}',
				domain: document.domain,
				token: '',
				trigger: true,
				animation: 200,
				template: 'material',
				ready: function () {},
				allow: function () {},
				disallow: function () {}
			}, typeof setting.pushmaze === 'string' ? { token: setting.pushmaze } : setting.pushmaze || {});

			setup.external = tag(setup.external, general.template);

			if (!setting.files.modules.pushmaze.template[setup.template.toLowerCase()]) {
				return general.promise.pushmaze.reject();
			}

			createSetting(null, {
				allow: setup.allow,
				disallow: setup.disallow
			}, plugin.data.pushmaze);

			window._pmq = window._pmq || [];
			window.pm_url = setup.external;
			window.d_u = setup.domain;
			window.d_t = setup.token;
			window.firebaseMessagingPath = tag(setting.files.modules.pushmaze.messaging, general.template);

			function proccessPushmazeOptions(data) {
				return templateLink(createObjectWithKey(plugin.data.pushmaze, {
					offset: false,
					body: {
						styles: ''
					},
					promt: {
						title: {
							text: data.customization_opt_in.title || '',
							color: '#000',
							styles: ''
						},
						description: {
							text: data.customization_opt_in.sub_title || '',
							color: '#5f5f5f',
							styles: ''
						},
						size: 'default',
						indent: '15px',
						position: 'tc',
						background: '#fff',
						icon: {
							src: data.customization_opt_in.site_icon || getFavIcons() || '{url:first}/{remotePath}/img/notify-bell.svg',
							position: 'left',
							opacity: '',
							styles: ''
						},
						video: {
							opacity: '0.4',
							styles: '',
							src: {
								mp4: ''
							}
						},
						buttons: {
							styles: 'font-weight: bold;',
							allow: {
								text: data.customization_opt_in.allow_button_text || 'Allow',
								color: '#fff',
								background: '#1165f1',
								styles: ''
							},
							disallow: {
								text: data.customization_opt_in.disallow_button_text || 'Don\'t allow',
								color: '#1165f1',
								background: 'transparent',
								styles: ''
							}
						},
						hover: {
							body: '',
							background: '',
							container: ''
						}
					},
					background: {
						styles: '',
						video: null
					},
					chicklet: {
						text: data.customization_opt_in.chicklet_text || 'Get Notifications',
						position: data.customization_opt_in.chicklet_location || 'tr',
						background: data.customization_opt_in.chicklet_background_color || '#0084f6',
						color: data.customization_opt_in.chicklet_text_color || '#fff',
						styles: 'font-weight: bold;'
					}
				}));
			}

			var initPushmaze = function () {
				var load = getPromise();

				ajax(setting.files.modules.pushmaze.template[setup.template]).done(function (response) {
					general.$document.on('ajaxComplete', function (event, jqXHR, params) {
						if (params && params.url && params.url.includes(setup.external + 'api/domain/check')) {
							jqXHR.done(function (data) {
								if (!data || (data && !data.customization_opt_in)) {
									return load.resolve();
								}

								var options = proccessPushmazeOptions(data);

								var html = tag(response, $.extend(true, {}, general.template, options));

								var $html = templateEngine(html);
								
								createSetting(null, {
									trigger: setup.trigger,
									animation: setup.animation,
									html: $html,
									bodyStyle: $html.find('[data-pushmaze-body-style]').html()
								}, plugin.data.pushmaze);

								$(document).on('ajaxComplete', function (completeEvent, jqXHR, params) {
									if (params && params.url && params.url.includes(general.catch.send)) {
										jqXHR.done(function (data) {
											if (data.code === 1 && general.Config.registration === true) {
												$('[data-pushmaze-disallow]').on('click touch', function (clickEvent) {
													clickEvent.preventDefault();
													window.location.href = data.message;
												});
											}
										});
									}
								});

								if (options.pushmaze.offset) {
									var $offset = $('[data-pushmaze-offset]');
									var $promt = $('[data-pushmaze-promt]');
									$offset.css('height', $promt.height() + 'px');
									$(window).on('resize', function () {
										$offset.css('height', $promt.height() + 'px');
									});
								}

								var body = 'body > *:not([data-template-engine]) { '+ options.pushmaze.promt.hover.body +' }';
								var background = '.pushmaze-promt-hover-background { position: fixed; display: block; width: 100%; height: 100vh; transform: scale(1.5); z-index: 999999; '+ options.pushmaze.promt.hover.background +' }';

								$('[data-pushmaze-promt]').on({
									mouseenter: function () {
										$('head').append('<style data-pushmaze-hover-body>'+ body +'</style>');
										$('head').append('<style data-pushmaze-hover-background>'+ background +'</style>');
									},
									mouseleave: function () {
										$('style[data-pushmaze-hover-body]').remove();
										$('style[data-pushmaze-hover-background]').remove();
									}
								});

							});
						}
					});
					includeScript(setting.files.modules.pushmaze.js).done(function () {
						return load.resolve();
					}).fail(load.reject);
				}).fail(load.reject);

				return load;
			};

			general.promise.geoip.done(function (country) {
				window.countryCode = country;
			});

			initPushmaze().done(function () {
				setup.ready();
				general.promise.pushmaze.resolve();
			});

			return general.promise.pushmaze;
		}
		
		/** Шаблонизация html
		 * @description
		 * Шаблонизатор html, который даёт возможность использовать
		 * такие теги как: v-if/v-else, v-show, v-hide
		 * @param {String} html Строка html кода
		 * @returns {jQuery} jQuery коллекция html элементов
		 */
		function templateEngine(html) {
			var $html = $(parseHTML('<div data-template-engine>'+ html +'</div>'));

			var $selector = function (attr) {
				return $('['+ attr +']', $html);
			};

			var derective = {
				show: 'v-show',
				if: 'v-if',
				else: 'v-else',
				hide: 'v-hide'
			};

			if ($selector(derective.show).length) {
				$.each($selector(derective.show), function () {
					var value = $(this).attr(derective.show);
					if (isFalsyString(value)) {
						$(this).remove();
					}
					$(this).removeAttr(derective.show);
				});
			}

			if ($selector(derective.if).length) {
				$.each($selector(derective.if), function () {
					var value = $(this).attr(derective.if);
					var $else = $(this).next('['+ derective.else +']');
					if (value.startsWith('javascript:')) {
						var expression = value.replace(/^javascript:/i, '');
						if (contextEval(this, $.trim(expression))) {
							$(this).removeAttr(derective.if);
							$else.remove();
						} else {
							$else.removeAttr(derective.else);
							$(this).remove();
						}
					} else {
						if (isFalsyString(value)) {
							$else.removeAttr(derective.else);
							$(this).remove();
						} else {
							$(this).removeAttr(derective.if);
							$else.remove();
						}
					}
				});
			}

			if ($selector(derective.hide).length) {
				$.each($selector(derective.hide), function () {
					$(this).hide().removeAttr(derective.hide);
				});
			}

			return $html;
		}

		function contextEval(context, js) {
			return function () {
				try {
					return eval(js);
				} catch (error) {
					console.error('FormJS: Error in contextEval function', error);
				}
			}.call(context);
		}

		function isFalsyString(value) {
			return ['false', 'NaN', 'null', 'undefined', '0', ''].includes(value);
		}

		/**
		 * Получить ссылку на найбольшую по размерам favicon сайта
		 */
		function getFavIcons() {
            var sizes = [];
            $.each($('link[rel="icon"]', general.$head), function () {
                var size = $(this).attr('sizes');
                size && sizes.push(window.parseInt(size, 10));
            });
            var max = Math.max.apply(null, sizes);
            return $('link[rel="icon"][sizes="'+ max +'x'+ max +'"]').attr('href');
        }

		/**
		 * Автоматический скрол в самое начало списка стран при клике на кнопку
		 */
		function countryListScrollTop() {
			$('div.flag-container', general.$form).on('click touch', function (event) {
				event.preventDefault();
				event.stopPropagation();
				$('ul.country-list', this).scrollTop(0);
			});
		}

		/**
		 * @module
		 * Модуль подключения autoform.js
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleForm() {
			var form = $[plugin.name + '_Form'];
			if (form) {
				if (typeof form === 'function') {
					return form(setting.files.form);
				}
				return form;
			}
			return getPromise('resolve');
		}
		
		
		/**
		 * @module
		 * Модуль перехода на вторую страницу, не меняя URL
		 **/
		function moduleSinglePage() {
			if (!setting.singlePage) return
			
			var firstForm = $('form[action]');
			
			firstForm.submit(function(e) {
				e.preventDefault()
				showPreloader()
				
				var formData = firstForm.serialize()
				var loc = window.location.href
				var newUrl = loc.indexOf('?') === -1 ? loc + '?' + formData : loc + '&' + formData
				
				window.history.replaceState({}, '', newUrl)
				
				setTimeout(function() {
					$.get('./' + firstForm.attr('action')).done(function(data) {
						var newDoc = document.open("text/html", "replace")
						newDoc.write(data)
						newDoc.close()
					})
				}, 500)
			})
		}
		
		/**
		 * Показать прелоадер
		 */
		function showPreloader() {
			var container = document.createElement('div')
			var preloader = new Image()
			
			container.id = 'firstToSecondPagePreloader'
			container.setAttribute(
				'style',
				'position:fixed;' +
				'background:rgba(0,0,0,.85);' +
				'left:0;' +
				'top:0;' +
				'width:100%;' +
				'height:100%;' +
				'z-index:999999999;'
			)
			preloader.src = templateLink('{url:first}/{remotePath}/img/spinner.gif');
			preloader.setAttribute(
				'style',
				'position:absolute;' +
				'display:block;' +
				'left:50%;' +
				'top:50%;' +
				'width:100px;' +
				'height:100px;' +
				'transform:translate(-50%,-50%);'
			)
			
			container.appendChild(preloader)
			document.body.appendChild(container)
		}
		
		/**
		 * Скрыть прелоадер
		 **/
		function hidePreloader() {
			var preloader = document.getElementById('firstToSecondPagePreloader')
			document.body.removeChild(preloader)
		}

		/**
		 * Выполнить запрос, чтобы выполнить скрипт
		 * @param {array<string>} link - массив ссылок
		 * @param {Object} setup Параметры AJAX запроса
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function includeScript(link, setup) {
			if (!link || (link && !link.length)) return getPromise('resolve');
			if (Array.isArray(link)) {
				return requestAll(link, function (item) {
					return Array.isArray(item) ? getScript(item) : ajax(item, $.extend(true, {}, plugin.ajax.script, setup || {}));
				});
			}
			return ajax(link, $.extend(true, {}, plugin.ajax.script, setup || {}));
		}

		/**
		 * @module
		 * Модуль вставки html и js файла Congrats
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleCongrats() {
			if (setting.congrats === false || !setting.files.modules.congrats) {
				window.congrats = function () { };
				return general.promise.congrats.resolve();
			}

			var initCongrats = function (html) {
				if (html) general.$body.append(html);
				moduleCongratsEvent();
				general.promise.congrats.resolve();
			};

			verifyHTML(general.selector.congrats) ?
				initCongrats() :
				ajax(setting.files.modules.congrats).done(initCongrats);

			return general.promise.congrats;
		}

		/**
		 * @module
		 * Модуль определения функция и событий запускающих Congrats
		 * @returns {undefined}
		 **/
		function moduleCongratsEvent() {
			var setup = {
				// Инстанс Parallax
				parallax: (function () {
					if (window.Parallax) {
						try {
							return new Parallax(document.querySelector(general.selector.parallax));
						} catch (error) {
							return null;
						}
					}
					return null;
				})(),

				// Основной контейнер
				container: $('.congrats'),

				// Кнопка закрытия окна
				close: $('.congrats__close'),

				// Заголовок и текст окна
				titleText: $('.congrats-left__title, .congrats-left__text'),

				// Прелоадер
				preloader: $('.preloader'),

				// Элемент изображения
				item: function (number) {
					return $('.congrats-right__item-' + number + ' img');
				}
			};

			if (setting.setup && setting.setup.congrats) setup = $.extend({}, setup, setting.setup.congrats);

			window.congrats = function () {
				setup.container.fadeIn(200);

				setup.item(1).fadeIn().css({
					transform: 'scale(1)'
				});

				setTimeout(function () {
					setup.item(2).fadeIn(750);
				}, 750);

				setTimeout(function () {
					setup.item(3).fadeIn(750);
					setTimeout(function () {
						setup.item(3).css({
							animation: 'shake .75s linear'
						});
					}, 500);
				}, 1250);

				setup.titleText.slideDown(1200);

				setTimeout(function () {
					setup.preloader.fadeIn(700);
				}, 1000);

				setup.close.slideDown(1000);
			};

			setup.close.on('click touch', function (event) {
				event.preventDefault();
				setup.container.fadeOut(200);
			});
		}


		/**
		 * @module
		 * Модуль определения событий для popup "Соглашения" и "Политики"
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleTermsEvent() {
			var popup = {
				// Продолжительность анимации
				animation: 200,

				// Основной контейнер
				terms: $('.terms'),

				// Контейнер заднего фона
				overlay: $('.terms-overlay'),

				// Селекторы модальных окон
				window: {
					// Селектор окна Пользовательское Соглашение
					use: $('.terms--use'),
					// Селектор окна Политика Конфиденциальности
					policy: $('.terms--policy'),
					// Селектор окна Политика Cookie
					cookie: $('.terms--cookie')
				},

				// События открытия/закрытия
				event: 'click touch',

				// Объект кнопок вызывающих окна (для поддержки старых версий)
				button: {
					// Пользовательское Соглашение
					use: '.terms-popup',

					// Политика Конфиденциальности
					policy: '.policy-popup'
				},

				// Универсальный триггер открытия окна, принимает название окна,
				// например: <a href="#" data-terms="policy">Policy</a> или <a href="#" data-terms="use">Use</a>
				trigger: 'data-terms',

				// Универсальный триггер закрытия окна
				close: 'data-terms-close',

				// Методы модальных окон
				methods: {
					open: function (type) {
						if (!type) return;
						var $modal = popup.window[type.toLowerCase()] || $('.terms--' + type);
						popup.overlay.fadeIn(popup.animation);
						$modal.fadeIn(popup.animation);
						clearTimeout(termsTimeout);
                        var termsTimeout = setTimeout(function () {
							triggerEvent.apply(general.apply, $.merge([plugin.event.terms.opened], [popup]));
							setting.terms.opened.apply(this, [popup]);	
						}, popup.animation)

						return $modal;
					},
					close: function () {
						popup.overlay.fadeOut(popup.animation);
						popup.terms.fadeOut(popup.animation);
						
						clearTimeout(termsTimeout);
                        var termsTimeout = setTimeout(function () {
							triggerEvent.apply(general.apply, $.merge([plugin.event.terms.closed], [popup]));
							setting.terms.closed.apply(this, [popup]);
						}, popup.animation)
						return popup.terms;
					}
				}
			};

			if (setting.setup && setting.setup.terms) popup = $.extend(true, {}, popup, setting.setup.terms);

			createSetting(null, popup, plugin.data.terms);

			var concat = function (strings, separator) {
				if (!separator) separator = ', ';
				return strings.join(separator);
			};

			var dataAttr = function (attr) {
				return '[' + attr + ']';
			};

			general.$document.on(popup.event, dataAttr(popup.trigger), function (event) {
				event.preventDefault();
				var type = $(this).attr(popup.trigger).toLowerCase();
				if (!type) return false;
				popup.methods.open(type);
			});

			general.$document.on(popup.event, concat([popup.button.use, popup.button.policy]), function (event) {
				event.preventDefault();
				if ($(this).hasClass(popup.button.use.slice(1))) {
					popup.methods.open('use');						
				} else if ($(this).hasClass(popup.button.policy.slice(1))) {
					popup.methods.open('policy');
				} else {
					popup.methods.open($(this).attr('data-terms'));
				}
			});

			general.$document.on(popup.event, concat(['.terms__close', dataAttr(popup.close)]), function (event) {
				event.preventDefault();
				popup.methods.close();
			});
		}

		/**
		 * @module
		 * Модуль вставки html файлов popup "Соглашения" и "Политики"
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function moduleTerms() {
			if (setting.terms.default === false || !setting.files.modules.terms) return general.promise.terms.resolve();

			var initTerms = function (html) {
				if (html) general.$body.append(html);
				moduleTermsEvent();
				return general.promise.terms.resolve();
			};

			if (verifyHTML(general.selector.terms.use) && verifyHTML(general.selector.terms.policy) && verifyHTML(general.selector.terms.cookie)) {
				initTerms();
			} else {
				ajax(setting.files.modules.terms).done(initTerms);
			}

			return general.promise.terms;
		}

		/**
		 * Подключения CSS стилей
		 * @param {array<string>} link - массив ссылок
		 * @returns {object} - $.Deferred() объект, promise
		 **/
		function includeStyle(link) {
			if (!link || (link && !link.length)) return getPromise('resolve');
			if (Array.isArray(link)) {
				return requestAll(link, function (item) {
					return ajax(item, plugin.ajax.style);
				});
			}
			return ajax(link, plugin.ajax.style);
		}

		/**
		 * Чтение и обработка пользовательских методов
		 * @param {string} method - название метода
		 * @param {any} - другие параметры методов
		 * @returns method
		 **/
		function publicMethods(method) {
			var setting = getSetting(plugin.data.setting);
			var params = Array.prototype.slice.call(arguments, 1);
			switch (method.toLowerCase()) {
				case 'get':
					return getSetting.apply(general.apply, params);
				case 'getscript':
				case 'failed':
					return getScript.apply(general.apply, params);
				case 'exitpopup':
					if (setting.exitpopup === false) {
						return message('Параметр настроек exitpopup выключен', setting.exitpopup);
					}
					return getSetting(plugin.data.exitpopup).methods;
				case 'waitpopup':
					if (setting.waitpopup === false) {
						return message('Параметр настроек waitpopup выключен', setting.waitpopup);
					}
					return getSetting(plugin.data.waitpopup).methods;
				case 'terms':
					return getSetting(plugin.data.terms).methods;
				case 'saleagent':
					return getSetting(plugin.data.saleagent);
				case 'info':
					return getSettingInfo(setting);
				case 'methods':
					return {
						once: function (callback, id) {
							if (!flags[id]) {
								flags[id] = true;
								callback();
							}
						},
						timeoutOnce: function (delay, callback, id) {
							if (!flags[id]) {
								flags[id] = true;
								setTimeout(callback, delay);
							}
						},
						timeoutLoop: timeoutLoop
					};
				case 'pushmaze':
					return {
						changeTag: function(tag_id) {
							$.post(setting.external['url:push'] + 'api/subscriber/change_tag', {
		                        'token': window.window.localStorage.getItem('token'),
		                        'tag_id': tag_id
		                    })
						},
						open: function () {
							$('[data-pushmaze-promt]').fadeIn();
							$('[data-pushmaze-background]').fadeIn();
							$('[data-pushmaze-chicklet]').fadeOut();
							$('[data-pushmaze-background-video]').fadeIn();
							$('body').append('<style data-pushmaze-body-style>'+ window.FormJS.pushmaze.bodyStyle +'</style>');
						},
						close: function () {
							$('[data-pushmaze-chicklet]').fadeIn();
							$('[data-pushmaze-background]').fadeOut();
							$('[data-pushmaze-body-style]').remove();
							$('[data-pushmaze-promt]').fadeOut();
							$('[data-pushmaze-background-video]').fadeOut();
						}
					};
			}
		}

		/** Рекурсивное выполнение timeout
		 * @param {Array<Number>} delays Массив задержки таймеров
		 * @param {Function} callback Callback функция выполнения одного таймера
		 * @param {Number} [start = 0] Начало отсчета
		 * @returns {undefined}
		 */
		function timeoutLoop(delays, callback, finish, start) {
			if (start === undefined) start = 0;
			if (delays.length === start) {
				return finish && finish();
			}
			if (delays[start]) {
				setTimeout(function () {
					callback(delays[start]);
					timeoutLoop(delays, callback, finish, ++start);
				}, delays[start]);
			}
		}

		/** Выполнять Ajax запросы, в случаи ошибки запрашивать следующий url
		 * @param {array<string>} items - массив ссылок
		 * @param {number} index - индекс элемента массива
		 * @param {object} params - дополнительные параметры ajax объекта
		 * @returns {object} - $.Deferred() объект (promise)
		 **/
		function getScript(items, index, params) {
			if (!index) index = 0;
			var setup = $.extend(true, {}, plugin.ajax.script, params || {});
			if (!Array.isArray(items)) return ajax(items, setup);
			return ajax(items[index], setup).fail(function () {
				index++;
				if (items[index]) getScript(items[index], index, params);
			});
		}

		return general.promise.init;

	}));

	/** Получить рандомное целое число включая min и max
	 * @param {number} min - минимальное число
	 * @param {number} max - максимальное число
	 * @returns {number} - рандомное число
	 **/
	function getRandom(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Проверить есть ли свойства нужного CSS файла
	 * @param {string} selector - тег создаваемого элемента, например: div, span, ul, li
	 * @param {object} attr - объект атрибутов элемента
	 * @param {function} checker - callback функция сравнения, получения результата
	 * @returns {boolean} - файл подключен (true), не подключен (false)
	 **/
	function verifyCSS(selector, attr, checker) {
		var tag = plugin.name + '_' + Date.now();
		var $selector = general.$body.append($('<' + selector + '/>', $.extend({}, attr, {
			id: tag
		}))).find('#' + tag);
		var result = !!checker($selector);
		$selector.remove();
		return result;
	}

	/**
	 * Проверить есть ли нужный селектор на странице
	 * @param {string} selector - селектор, например '.test-class' или '[data-test-attr]'
	 * @returns {boolean} - есть (true), нет (false)
	 **/
	function verifyHTML(selector) {
		return !!$(selector).length;
	}

	/**
	 * Чтение и переобразования шаблонных переменных в строках
	 * @param {array<string>|string} link - массив строк или строка
	 * @returns {array<string>|string} - переобразованный массив строк или строка
	 **/
	function templateLink(link) {
		if (typeof link === 'object') {
			if (Array.isArray(link)) {
				return $.map(link, function (item) {
					return tag(item, general.template);
				});
			} else {
				for (var key in link) {
					if (typeof link[key] === 'object') {
						templateLink(link[key]);
					} else {
						link[key] = tag(link[key], general.template);
					}
				}
				return link;
			}
		} else {
			return tag(link, general.template);
		}
	}

	/**
	 * Вывод сообщений в консоль браузера
	 * @param {any} - параметры ошибки
	 * @returns undefined
	 **/
	function message() {
		var setting = getSetting(plugin.data.setting);
		if (setting.logger === false) return false;
		var args = $.map(Array.prototype.slice.call(arguments, 0), function (item) {
			if (typeof item === 'string') {
				return tag(item, general.template);
			}
		});
		console.error.apply(general.apply, $.merge([plugin.name + ':'], args.length ? args : []));
	}

	/** Проверить не начинается ли строка с переданной строки и позиции
	 * @param {String} string Строка для проверки
	 * @param {String} search Искомая строка
	 * @param {Number} [position = 0] Начальная позиция
	 * @returns {Boolean}
	 */
	function stringStartsWith(string, search, position) {
		if (String.prototype.startsWith) {
			return string.startsWith(search, position);
		} else {
			position = position || 0;
			return string.indexOf(search, position) === position;
		}
	}

	/**
	 * Парсинг HTML из строки
	 * @param {string} html - строка html
	 * @returns {node} - dom node элемент
	 **/
	function parseHTML(html) {
		var page = document.implementation.createHTMLDocument();
		page.body.innerHTML = html;
		return page.body.children;
	}

	/**
	 * Получить $.Deferred() объект после выполнения всех запросов, аналог Promise.all()
	 * @param {array<string>} links - массив ссылок
	 * @param {function} each - callback функция push запроса в массив promise
	 * @returns {object} - $.Deferred() объект, promise
	 **/
	function requestAll(links, each) {
		var promise = [];
		links.forEach(function () {
			promise.push(each.apply(general.apply, arguments));
		});
		return $.when.apply(general.apply, promise);
	}

	/**
	 * Выполнить AJAX запрос
	 * @param {string} link - ссылка
	 * @param {object} params - объект дополнительных параметров $.ajax
	 * @returns {object} - $.Deferred() объект, promise
	 **/
	function ajax(link, params) {
		if (link !== undefined && typeof link !== 'string') {
			message(plugin.message.invalidUrl, link);
			return getPromise('reject', link);
		}
		return $.ajax($.extend(true, {}, plugin.ajax.setup, params, {
			url: tag(link, general.template)
		})).fail(function () {
			message(plugin.message.notFound, link);
		}).always(function (data, status, jqXHR) {
			var setup = this;
			var file = function (file) {
				return file ? setup.url.indexOf(file) !== -1 ? setup.url : false : setup.url;
			};
			triggerEvent(plugin.event.ajax, file, data, jqXHR, setup);
		});
	}

	/**
	 * Создание/тригер события
	 * @param {string} name - название события
	 * @param {any} arguments - экстра параметры
	 **/
	function triggerEvent(name) {
		var params = Array.prototype.slice.call(arguments, 1);
		general.$document.trigger(name + '.' + plugin.name, params.length ? params : undefined);
	}

	/**
	 * Обработка тегов, шаблонизатор
	 * @param {string} - входные данные
	 * @param {string|object} - название искомого тега или объект {тег - значение}
	 * @param {string} - значение, на которое должен заменится тег
	 * @returns {string} - выходные, обработаные данные
	 **/
	function tag(input, data, original) {
		if (!['string', 'object'].includes(typeof input)) {
			return input;
		}
		for (var key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
					var nested = {};
					for (var name in data[key]) {
						try {
							if (original === undefined) {
								original = data;
								nested[key] = true; //JSON.stringify(objectPath(original, key));
							} else {
								nested[key] = true; //JSON.stringify(objectPath(original, key));
							}
						} catch (error) {
						}
						nested[key + '.' + name] = data[key][name];
					}
					input = tag(input, nested, original);
				} else {
					input = input.replace(new RegExp('\{' + key + '\}', 'g'), data[key]);
				}
			}
		}
		return input;
	}

	function objectPath(object, key, value) {
		var path = key.split('.');
		var get = function(array, start) {
			return array.reduce(function(previous, current) {
				return previous[current];
			}, start);
		};
		if (value) {
			var way = path.pop();
			get(path, object)[way] = value;
			return object;
		} else {
			return get(path, object);
		}
	}

	/**
	 * Перебор объекта, forEach для объекта
	 * @param {object} object - объект
	 * @param {function} callback - callback функция перебора
	 * @returns {undefined}
	 **/
	function eachObject(object, callback) {
		if (!callback) return;
		for (var item in object) callback(object[item], $.isNumeric(item) ? Number(item) : item, object);
	}

	/**
	 * Получить $.Deferred(), promise
	 * @param {string} type - тип выполнения promise (resolve, reject)
	 * @param {any} - параметры для передачи в resolve/reject
	 * @returns {object} - $.Deferred() объект, promise
	 **/
	function getPromise(type, data) {
		var promise = $.Deferred();
		if (type) promise[type].apply(general.apply, Array.prototype.slice.call(arguments, 1) || []);
		return promise;
	}

	/**
	 * Получить настройки инициализации плагина
	 * @param {string} key - категория настроект (setting)
	 * @returns {object} - объект параметров иницилизации
	 **/
	function getSetting(key) {
		var setting = window[plugin.name];
		return key ? setting[key] : setting;
	}

	/** Получить состояние формы. Параметры инициализации
	 * @param {Object} setting Настройки
	 * @returns {undefined}
	 */
	function getSettingInfo(setting) {
		var createConsoleGroup = function (content) {
			return console.group(decodeURIComponent(escape(window.atob(content))));
		};

		console.clear();

		createConsoleGroup('dmVyc2lvbiAtINCS0LXRgNGB0LjRjyDQv9C70LDQs9C40L3QsA==');
		console.log(plugin.version);
		console.groupEnd();

		createConsoleGroup('cGF0aCAtINCf0YPRgtGMINC6INC/0LDQv9C60LUg0L/Qu9Cw0LPQuNC90LA=');
		console.log(setting.path);
		console.groupEnd();

		createConsoleGroup('bGFuZ3VhZ2UgLSDQr9C30YvQuiDQvNC+0LTRg9C70LXQuSDQv9C70LDQs9C40L3QsA==');
		console.log(setting.language.toUpperCase());
		console.groupEnd();

		createConsoleGroup('Y29sb3IgLSDQntGB0L3QvtCy0L3QvtC5ICJwcmltYXJ5IiDRhtCy0LXRgiDRgdCw0LnRgtCw');
		console.log('%c' + setting.color, 'background: '+ setting.color +'; color: #000');
		console.groupEnd();

		createConsoleGroup('ZXh0ZXJuYWwgLSDQktC90LXRiNC90LjQtSBVUkwg0LDQtNGA0LXRgdGB0LAg0LTQu9GPINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINCyINC/0LvQsNCz0LjQvdC1');
		console.log(Object.values(setting.external).join(', '));
		console.groupEnd();

		createConsoleGroup('Y29va2llIC0g0KTQuNC60YHQuNGA0L7QstCw0L3QvdGL0Lkg0LHQu9C+0Log0YHQvtCz0LvQsNGI0LXQvdC40Y8g0YEg0L/QvtC70LjRgtC40LrQvtC5IENvb2tpZQ==');
		console.log(setting.cookie);
		console.groupEnd();

		createConsoleGroup('d2FpdHBvcHVwIC0g0JzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+INCy0YHQv9C70YvQstCw0Y7RidC40LUg0L/QvtGB0LvQtSDQv9C+0YLQtdGA0Lgg0YTQvtC60YPRgdCwINC90LAg0YTQvtGA0LzQtQ==');
		console.log(setting.waitpopup);
		console.groupEnd();

		createConsoleGroup('c2F2ZWlucHV0IC0g0JDQstGC0L7Qt9Cw0L/QvtC70L3QtdC90LjQtSDQtNCw0L3QvdGL0YUg0YTQvtGA0LzRiyDQuNC3IGNvb2tpZSBtb25leXRyYWNr');
		console.log(setting.saveinput);
		console.groupEnd();

		createConsoleGroup('cHJlZmVycmVkIC0g0JLRi9Cy0L7QtCDQutC90L7Qv9C60LggItCf0L7QutCw0LfQsNGC0Ywg0LTRgNGD0LPQuNC1IiDQv9GA0Lgg0LLRi9Cx0L7RgNC1INGB0YLRgNCw0L3RiyDQsiDQv9C+0LvQtSDRgtC10LvQtdGE0L7QvQ==');
		console.log(setting.preferred);
		console.groupEnd();

		createConsoleGroup('c2FsZWFnZW50IC0g0JzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+INC/0L7RgdC70LUg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCBTYWxlQWdlbnQ=');
		console.log(window.CONFIG ? window.CONFIG.enableAgentGenderSelector : false);
		console.groupEnd();

		createConsoleGroup('cmVnaXN0ZXIgLSDQodC+0LHRi9GC0LjRjyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4');
			createConsoleGroup('0KPRgdC/0LXRiNC90L4=');
			console.log.apply(null, !['function(e,t,n){}', 'function (data, jqXHR, params) { }'].includes(setting.register.done.toString()) ? [true, setting.register.done.toString()] : [false]);
			console.groupEnd();

			createConsoleGroup('0J7RiNC40LHQutCw');
			console.log.apply(null, !['function(e,t,n){}', 'function (data, jqXHR, params) { }'].includes(setting.register.fail.toString()) ? [true, setting.register.fail.toString()] : [false]);
			console.groupEnd();

			createConsoleGroup('0JLRgdC10LPQtNCw');
			console.log.apply(null, !['function(e,t,n){}', 'function (data, jqXHR, params) { }'].includes(setting.register.always.toString()) ? [true, setting.register.always.toString()] : [false]);
			console.groupEnd();

		console.groupEnd();

		createConsoleGroup('cHVzaG1hemUgLSBQVVNIINGD0LLQtdC00L7QvNC70LXQvdC40Y8=');
		console.log.apply(null, setting.pushmaze ? [true, setting.pushmaze] : [false]);
		console.groupEnd();

		createConsoleGroup('Y29uZ3JhdHMgLSDQrdC60YDQsNC9INGD0YHQv9C10YjQvdC+0Lkg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuA==');
		console.log(!!setting.files.modules.congrats);
		console.groupEnd();

		createConsoleGroup('dGVybXMgLSDQnNC+0LTQsNC70YzQvdGL0LUg0L7QutC90LAgItCf0L7Qu9C40YLQuNC60LgsINCh0L7Qs9C70LDRiNC10L3QuNGPLCBDb29raWU=');
		console.log(!!setting.files.modules.terms);
		console.groupEnd();

		createConsoleGroup('cmlzayAtINCi0LXQutGB0YIg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjRjyDQviDRgNC40YHQutCw0YU=');
		console.log.apply(null, setting.risk ? [true, setting.risk] : [false]);
		console.groupEnd();

		createConsoleGroup('dXJsY2F0Y2ggLSDQn9C10YDQtdGF0LLQsNGCIEdldCDQv9Cw0YDQsNC80LXRgtGA0L7QsiBVUkwg0LTQu9GPINC00LLRg9GF0YHRgtGA0LDQvdC40YfQvdGL0YUg0YTQvtGA0Lw=');
		console.log(setting.urlcatch);
		console.groupEnd();

		createConsoleGroup('YmluZGluZyAtINCU0LLRg9GF0YHRgtC+0YDQvtC90L3Rj9GPINC/0YDQuNCy0Y/Qt9C60LAg0LfQsNC/0L7Qu9C90LXQvdC40Y8g0YTQvtGA0Lw=');
		console.log(setting.binding);
		console.groupEnd();

		createConsoleGroup('bWlzc2VkIC0g0J/RgNC+0LzQsNGFINC/0L4g0LDQutGC0LjQstC90YvQvCDRjdC70LXQvNC10L3RgtCw0Lw=');
		console.log.apply(null, setting.missed ? [true, setting.missed] : [false]);
		console.groupEnd();

		createConsoleGroup('cGF5bWVudCAtINCb0LXQvdGC0LAg0LvQvtCz0L7RgtC40L/QvtCyINC/0LvQsNGC0ZHQttC90YvRhSDRgdC40YHRgtC10Lw=');
		console.log.apply(null, setting.payment ? [true, setting.payment] : [false]);
		console.groupEnd();

		createConsoleGroup('bG9nb3R5cGUgLSDQm9C10L3RgtCwINC70L7Qs9C+0YLQuNC/0L7QsiDQv9C+0LQg0YTQvtGA0LzQvtC5');
		console.log.apply(null, setting.logotype ? [true, setting.logotype] : [false]);
		console.groupEnd();

		createConsoleGroup('0J/Rg9GC0Lgg0Log0L/QvtC00LrQu9GO0YfQtdC80YvQvCDRhNCw0LnQu9Cw0Lwg0LzQvtC00YPQu9C10Lk=');
			createConsoleGroup('Q29uZmlnLmpz');
			console.log(setting.files.config);
			console.groupEnd();

			createConsoleGroup('Rm9ybS5qcw==');
			console.log(setting.files.form);
			console.groupEnd();

			createConsoleGroup('0JzQvtC00YPQu9C4');
			console.log(setting.files.modules);
			console.groupEnd();
		console.groupEnd();

		createConsoleGroup('Y29uZmlnIC0g0J/QsNGA0LDQvNC10YLRgNGLINC40LcgQ29uZmlnLmpz');
		console.log(window.CONFIG || false);
		console.groupEnd();
	}

	/**
	 * Создание объекта настроек плагина
	 * @param {object} defaults - объект настроек по умолчанию
	 * @param {object} setting - переданные настройки
	 * @param {string} key - название объекта параметров, ключ
	 * @param {function} filter - функция обработки объекта перед созданием
	 * @returns {object} - объект настроек
	 **/
	function createSetting(defaults, setting, key, filter) {
		var params = $.extend(true, {}, defaults, setting);
		if (filter) filter(params);
		window[plugin.name] = $.extend(true, {}, window[plugin.name], createObjectWithKey(key, params));
		return params;
	}

	/**
	 * Создать объек по ключу
	 * @param {string} key - ключ
	 * @param {any} value - значение
	 * @returns {object} - объект с переданным ключем и значением
	 **/
	function createObjectWithKey(key, value) {
		var object = {};
		object[key] = value;
		return object;
	}

}(jQuery));
