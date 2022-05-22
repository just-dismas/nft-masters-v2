var LinksReplacer = new function () {

    this.init = function(domains) {
        var nodeList = document.getElementsByTagName("a");
        for (var i = 0; i < nodeList.length; i++){
            for (var j = 0; j < domains.length; j++){
                if (nodeList[i].href.indexOf(domains[j])!=-1) {
                    var urlParams = this.getQueryParams(document.location.search);
                    var linkParams = this.getQueryParams(nodeList[i].href)
                    var params = Object.assign(linkParams, urlParams)
                    nodeList[i].href = nodeList[i].href.split('?')[0] + '?' + this.toQueryString(params);
                }
            }
        }
    }

    this.getQueryParams = function (str) {
        str = str.split('?')[1];
    
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
    
        while (tokens = re.exec(str)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        params = this.mapKeys(params, function (val, key) {
            return LinksReplacer.toCamelCase(key)
        });
        return params;
    }
    
    this.toQueryString = function (data) {
        return Object.keys(data).map(function (key) {
            return key + '=' + encodeURIComponent(data[key])
        }).join('&');
    }

    this.mapKeys = function (obj, fn) {
        return Object.keys(obj).reduce(function (acc, k) {
            acc[fn(obj[k], k, obj)] = obj[k];
            return acc;
        }, {});
    }

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

}