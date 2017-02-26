angular.module('app', [

    // external libs
    'ngRoute',
    'ngMessages',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngMaterial',
    'ngProgress',
    'duScroll',

    // this is how it accesses the cached templates in ti.js
    'templates.app',

    // services
    'numFormat',

    // pages
    "landing"

]);




angular.module('app').config(function ($routeProvider,
                                       $mdThemingProvider,
                                       $locationProvider) {
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette("blue")



});


angular.module('app').run(function($route,
                                   $rootScope,
                                   $q,
                                   $timeout,
                                   $cookies,

                                   $http,
                                   $location) {

    //
    //(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    //        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    //    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    //})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    //ga('create', 'UA-23384030-1', 'auto');




    $rootScope.$on('$routeChangeStart', function(next, current){
    })
    $rootScope.$on('$routeChangeSuccess', function(next, current){
        //window.scrollTo(0, 0)
        //ga('send', 'pageview', { page: $location.url() });

    })



    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        console.log("$routeChangeError! here's some things to look at: ", event, current, previous, rejection)

        $location.url("page-not-found")
        window.scrollTo(0, 0)
    });
});



angular.module('app').controller('AppCtrl', function(
    ngProgressFactory,
    $rootScope,
    $scope,
    $route,
    $location,
    NumFormat,
    $http,
    $mdDialog,
    $sce){

    var progressBarInstance = ngProgressFactory.createInstance();

    $rootScope.progressbar = progressBarInstance
    $scope.progressbar = progressBarInstance
    $scope.numFormat = NumFormat
    $scope.moment = moment // this will break unless moment.js loads over network...

    $scope.global = {}

    $scope.pageTitle = function(){
        //if (!$scope.global.title){
        //    $scope.global.title = "Discover the online impact of your research"
        //}
        //return "Impactstory: " + $scope.global.title
        return "UnPaywall"
    }


    $rootScope.$on('$routeChangeSuccess', function(next, current){
        $scope.global.template = current.loadedTemplateUrl
            .replace("/", "-")
            .replace(".tpl.html", "")
        $scope.global.title = null
    })

    $scope.trustHtml = function(str){
        return $sce.trustAsHtml(str)
    }

    var showAlert = function(msgText, titleText, okText){
        if (!okText){
            okText = "ok"
        }
          $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(titleText)
                    .textContent(msgText)
                    .ok(okText)
            );
    }
    $rootScope.showAlert = showAlert
})
















angular.module('landing', [
    'ngRoute',
    'ngMessages'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/landing/:landingPageName', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/wood', {
            templateUrl: "wood.tpl.html",
            controller: "WoodPageCtrl"
        })
    })





    .config(function ($routeProvider) {
        $routeProvider.when('/page-not-found', {
            templateUrl: "page-not-found.tpl.html",
            controller: "PageNotFoundCtrl"
        })
    })

    .controller("PageNotFoundCtrl", function($scope){
        console.log("PageNotFound controller is running!")

    })

    .controller("WoodPageCtrl", function($scope){
        console.log("WoodPageCtrl controller is running!")

    })


    .controller("LandingPageCtrl", function ($scope,
                                             $document,
                                             $timeout) {

        console.log("i am the landing page ctrl")
        var about = angular.element(document.getElementById('about'));

        $scope.scrollToAbout = function(){
            console.log("scroll to about!", about)
            $document.scrollToElement(about, 0, 1000);
        }

        $scope.scrollToTop = function(){
            console.log("scroll to top.")
            $document.scrollTop(0, 1000)
        }




    })











angular.module("numFormat", [])

    .factory("NumFormat", function($location){

        var commas = function(x) { // from stackoverflow
            if (!x) {
                return x
            }
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }


        var short = function(num, fixedAt){
            if (typeof num === "string"){
                return num  // not really a number
            }

            // from http://stackoverflow.com/a/14994860/226013
            if (num === null){
                return 0
            }
            if (num === 0){
                return 0
            }

            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 100000) { // no decimal if greater than 100thou
                return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'k';
            }

            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }


            if (num < 1) {
                return Math.round(num * 100) / 100;  // to two decimals
            }

            return Math.ceil(num);
        }

        var round = function(num){
            return Math.round(num)
        }

        var doubleUrlEncode = function(str){
            return encodeURIComponent( encodeURIComponent(str) )
        }

        // from http://cwestblog.com/2012/09/28/javascript-number-getordinalfor/
        var ordinal = function(n) {
            n = Math.round(n)
            var s=["th","st","nd","rd"],
                v=n%100;
            return n+(s[(v-20)%10]||s[v]||s[0]);
        }

        var decimalToPerc = function(decimal, asOrdinal){
            var ret = Math.round(decimal * 100)
            if (asOrdinal){
                ret = ordinal(ret)
            }
            return ret
        }
        return {
            short: short,
            commas: commas,
            round: round,
            ordinal: ordinal,
            doubleUrlEncode: doubleUrlEncode,
            decimalToPerc: decimalToPerc

        }
    });
angular.module('templates.app', ['landing.tpl.html', 'page-not-found.tpl.html', 'wood.tpl.html']);

angular.module("landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("landing.tpl.html",
    "<div class=\"page landing\">\n" +
    "    <div class=\"top-screen screen\" layout=\"row\" layout-align=\"center center\">\n" +
    "        <div class=\"navbar\">\n" +
    "            <img id=\"logo\" src=\"static/img/logo.png\" alt=\"\">\n" +
    "            <a class=\"more\" href=\"\" ng-click=\"scrollToAbout()\">\n" +
    "                <i class=\"fa fa-question-circle-o\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"content\">\n" +
    "            <div class=\"tagline\">\n" +
    "                Find open-access versions of paywalled research papers, instantly.\n" +
    "            </div>\n" +
    "            <div class=\"about\">\n" +
    "               Every time you hit a paywalled article, Unpaywall automatically\n" +
    "                looks for a copy in our index\n" +
    "                of over 20 million free, legal fulltext PDFs.\n" +
    "                If we find one, we give you a link to read. Open access has never been easier.\n" +
    "            </div>\n" +
    "\n" +
    "            <a href=\"https://chrome.google.com/webstore/detail/unpaywall/iplffkdpngmdjhlpjmppncnlhomiipha\"\n" +
    "               class=\"main-button\">\n" +
    "                <i class=\"fa fa-chrome\"></i>\n" +
    "                <span class=\"text\">\n" +
    "                    <span class=\"big\">\n" +
    "                        Install it free\n" +
    "                    </span>\n" +
    "                    <span class=\"small\">\n" +
    "                        on the Chrome Web Store\n" +
    "                    </span>\n" +
    "                </span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"about-screen screen\" id=\"about\">\n" +
    "        <div class=\"content\">\n" +
    "            <h2>FAQ</h2>\n" +
    "            <dl>\n" +
    "                <dt>Who is behind Unpaywall?</dt>\n" +
    "                <dd>\n" +
    "                    Unpaywall is from <a href=\"http://impactstory.org\">Impactstory,</a>\n" +
    "                    a nonprofit working to supercharge science by making it\n" +
    "                    more open, reusable, and web-native.\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt>Why did you make it?</dt>\n" +
    "                <dd>\n" +
    "                    We got tired of running into paywalled articles! The worst part was, we knew\n" +
    "                    that millions of researchers are currently uploading their own fulltext PDFs\n" +
    "                    to <a href=\"https://en.wikipedia.org/wiki/Preprint\">preprint servers</a>\n" +
    "                    and <a href=\"https://en.wikipedia.org/wiki/Institutional_repository\">institutional repositories,</a>\n" +
    "                    worldwide, making them free for anyone to read. There was just no easy \n" +
    "                    way to find them, especially not one that was integrated into our \n" +
    "                    reading workflows. So we made one! Our long-term goal with\n" +
    "                    Unpaywall is to nurture the transition to a fully\n" +
    "                    <a href=\"https://en.wikipedia.org/wiki/Open_access\">open access</a>\n" +
    "                    scholarly publishing model, by closing the gap between readers and\n" +
    "                    freely-available fulltext.\n" +
    "\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt>How do I use this?</dt>\n" +
    "                <dd>\n" +
    "                    After you\n" +
    "                    <a href=\"https://chrome.google.com/webstore/detail/unpaywall/iplffkdpngmdjhlpjmppncnlhomiipha\">install the extension</a>\n" +
    "\n" +
    "                    we'll do the work in the background. When you view a paywalled article,\n" +
    "                    we'll search for a free legal copy. If we find one, you'll see a bright green\n" +
    "                    \"free\" tab on the right side of your browser window. Click on the tab, read the\n" +
    "                    article. If you want to see an example of Unpaywall working,\n" +
    "                    visit <a href=\"http://www.sciencedirect.com/science/article/pii/S0140673611617522\">this article</a>\n" +
    "                    after you've installed the extension.\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt>How often does Unpaywall actually find a free PDF for a given article?</dt>\n" +
    "                <dd>\n" +
    "                    Unfortunately not all authors upload their fulltext PDFs online&mdash;although\n" +
    "                    the number is growing every day. So sometimes there's no fulltext available online,\n" +
    "                    and Unpaywall comes up empty. The exact percentage depends on the age\n" +
    "                    and field of the article, but we generally find around 40% success.\n" +
    "                    There's actually been a bunch of research on this recently, and we're planning a blog\n" +
    "                    post breaking it down&mdash;stay tuned.\n" +
    "\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt>Where does your data come from?</dt>\n" +
    "                <dd>\n" +
    "                    We gather information from thousands of different open-access repositories, with the\n" +
    "                    help of a number of partners. In particular, we depend on data from\n" +
    "                    <a href=\"https://doaj.org/\">the DOAJ,</a>\n" +
    "                    <a href=\"https://www.crossref.org/\">Crossref,</a>\n" +
    "                    <a href=\"https://www.datacite.org/\">DataCite,</a>\n" +
    "                    and (especially) <a href=\"https://www.base-search.net/\">BASE.</a>\n" +
    "                    All this data is available for free via the API of another Impactstory project,\n" +
    "                    <a href=\"http://oadoi.org\">oaDOI.</a>\n" +
    "\n" +
    "                    The oaDOI API is fully free,\n" +
    "                    open, and scalable and lots of folks are building cool stuff on it already...check\n" +
    "                    it out if you'd like to build something too!\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt>How is this different from Sci-Hub?</dt>\n" +
    "                <dd>\n" +
    "                    Like Unpaywall, Sci-Hub finds fulltext PDFs for paywalled articles. The main difference\n" +
    "                    is where those PDFs come from: Unpaywall finds PDFs legally uploaded\n" +
    "                    by the authors themselves, while\n" +
    "                    Sci-Hub uses PDFs that are obtained by other means including automated web scraping\n" +
    "                    of publisher sites. Sci-Hub's method delivers more comprehensive results,\n" +
    "                    but is not super legal.\n" +
    "                    <a href=\"http://blog.impactstory.org/comparing-sci-hub-oadoi/\">We're not against Sci-Hub.</a>\n" +
    "                    But we  think Unpaywall offers a more sustainable approach, by working within copyright law\n" +
    "                    and supporting the growing open access movement.\n" +
    "                </dd>\n" +
    "\n" +
    "\n" +
    "                <dt>I found a bug</dt>\n" +
    "                <dd>\n" +
    "                    Sorry about that! Unfortunately this is not uncommon, mostly because\n" +
    "                    scholarly publishing is still sort of a wild west of missing and ignored\n" +
    "                    information standards, and this creates a number of problems for automatic systems like\n" +
    "                    Unpaywall. The good news is that it's still early days for this project and\n" +
    "                    it's under very active development. When you find an error,\n" +
    "                    <a href=\"mailto:team@impactstory.org\">drop us an email</a> and we'll get it fixed for you.\n" +
    "                </dd>\n" +
    "\n" +
    "            </dl>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"footer\">\n" +
    "    <div class=\"content\" layout=\"row\" layout-xs=\"column\">\n" +
    "\n" +
    "        <div class=\"links\" flex=\"40\" flex-xs=\"100\">\n" +
    "            <a href=\"mailto:team@impactstory.org\">\n" +
    "                <i class=\"fa fa-envelope-o\"></i>\n" +
    "                Email\n" +
    "            </a>\n" +
    "            <a href=\"http://twitter.com/impactstory\">\n" +
    "                <i class=\"fa fa-twitter\"></i>\n" +
    "                Twitter\n" +
    "            </a>\n" +
    "            <a href=\"http://github.org/Impactstory/unpawall\">\n" +
    "                <i class=\"fa fa-github\"></i>\n" +
    "                GitHub\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"logo\" flex=\"20\" hide-xs>\n" +
    "            <a href=\"/\" ng-click=\"scrollToTop()\">\n" +
    "                <img src=\"static/img/key.png\" alt=\"\">\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"credit\" flex=\"40\" flex-xs=\"100\">\n" +
    "            <span class=\"built-by\">\n" +
    "                Built with <i class=\"fa fa-heart\"></i> at\n" +
    "                <a href=\"http://impactstory.org/about\">Impactstory</a>, with support from\n" +
    "            </span>\n" +
    "            <span class=\"funders\">\n" +
    "                 the National Science Foundation and the Alfred P. Sloan Foundation\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("page-not-found.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("page-not-found.tpl.html",
    "<div class=\"landing static-page\">\n" +
    "    <h1>Sorry, we couldn't find that page!</h1>\n" +
    "\n" +
    "</div>");
}]);

angular.module("wood.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("wood.tpl.html",
    "<div class=\"page wood\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"icon-for-copy\">\n" +
    "        <i class=\"fa fa-envelope-o\"></i>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <table>\n" +
    "        <tr class=\"header\">\n" +
    "            <th class=\"check\">check</th>\n" +
    "            <th class=\"name\">Name</th>\n" +
    "            <th class=\"oa\">OA</th>\n" +
    "            <th class=\"boost\">Potential OA Boost</th>\n" +
    "            <th class=\"cites impact\">\n" +
    "                <div class=\"main\">Cites</div>\n" +
    "                <div class=\"below\">\n" +
    "                    <span class=\"now\">now</span>\n" +
    "                    <span class=\"oa\"><i class=\"fa fa-arrow-up\"></i> oa</span>\n" +
    "                </div>\n" +
    "            </th>\n" +
    "            <th class=\"downloads impact\">\n" +
    "                <div class=\"main\">Downloads</div>\n" +
    "                <div class=\"below\">\n" +
    "                    <span class=\"now\">now</span>\n" +
    "                    <span class=\"oa\"><i class=\"fa fa-arrow-up\"></i> oa</span>\n" +
    "                </div>\n" +
    "            </th>\n" +
    "            <th class=\"altmetrics impact\">\n" +
    "                <div class=\"main\">Altmetrics</div>\n" +
    "                <div class=\"below\">\n" +
    "                    <span class=\"now\">now</span>\n" +
    "                    <span class=\"oa\"><i class=\"fa fa-arrow-up\"></i> oa</span>\n" +
    "                </div>\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "\n" +
    "        <!-- reprobate -->\n" +
    "        <tr class=\"low-oa\">\n" +
    "            <td class=\"check\"><i class=\"fa fa-check-square-o\"></i></td>\n" +
    "            <td class=\"name\">Cindy Cortez</td>\n" +
    "            <td class=\"oa\">6<span class=\"percent\">%</span></td>\n" +
    "            <td class=\"boost high\"><i class=\"fa fa-arrow-up\"></i> High</td>\n" +
    "            <td>\n" +
    "                <span class=\"now cites\">1021</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>51</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">306k</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>294k</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">51</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>48</span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <!-- Joe Average -->\n" +
    "        <tr class=\"med-oa\">\n" +
    "            <td class=\"check\"><i class=\"fa fa-check-square-o\"></i></td>\n" +
    "            <td class=\"name\">Doris Nguyen</td>\n" +
    "            <td class=\"oa\">31<span class=\"percent\">%</span></td>\n" +
    "            <td class=\"boost med\"><i class=\"fa fa-arrow-up\"></i> Medium</td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">998</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>36</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">399k</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>199k</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">63</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>38</span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <!-- Joe Average Again -->\n" +
    "        <tr class=\"med-oa\">\n" +
    "            <td class=\"check\"><i class=\"fa fa-check-square-o\"></i></td>\n" +
    "            <td class=\"name\">Luther Peterson</td>\n" +
    "            <td class=\"oa\">27<span class=\"percent\">%</span></td>\n" +
    "            <td class=\"boost med\"><i class=\"fa fa-arrow-up\"></i> Medium</td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">1013</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>35</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">384k</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>185k</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">68</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>37</span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <!-- more highly-cited person -->\n" +
    "        <!--\n" +
    "        <tr class=\"med-oa\">\n" +
    "            <td class=\"check\"><i class=\"fa fa-check-square-o\"></i></td>\n" +
    "            <td class=\"name\">Marion Sherman</td>\n" +
    "            <td class=\"oa\">21<span class=\"percent\">%</span></td>\n" +
    "            <td class=\"boost med\"><i class=\"fa fa-arrow-up\"></i> Medium</td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">2029</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>71</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">727k</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>379</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">133</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>74</span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        -->\n" +
    "\n" +
    "        <!-- OA Fan -->\n" +
    "        <tr class=\"high-oa\">\n" +
    "            <td class=\"check\"><i class=\"fa fa-square-o\"></i></td>\n" +
    "            <td class=\"name\">Alex Lee</td>\n" +
    "            <td class=\"oa\">96<span class=\"percent\">%</span></td>\n" +
    "            <td class=\"boost low\"><i class=\"fa fa-arrow-up\"></i> Low</td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">1584</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>3</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">951k</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>19k</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">154</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>6</span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "        <!-- TOTAL -->\n" +
    "        <tr class=\"total\">\n" +
    "            <td class=\"check\"><i class=\"fa fa-square-o\"></i></td>\n" +
    "            <td class=\"name\">All Selected</td>\n" +
    "            <td class=\"oa\">32<span class=\"percent\">%</span></td>\n" +
    "            <td class=\"boost med\"><i class=\"fa fa-arrow-up\"></i> Medium</td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">4616</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>125</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">2.1M</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>697k</span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span class=\"now\">336</span>\n" +
    "                <span class=\"boost\"><span class=\"plus\">+</span>129</span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
