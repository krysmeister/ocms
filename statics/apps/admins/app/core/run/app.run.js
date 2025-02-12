define(['authLoginService'], function () {
    'use strict';

    angular.module('appAdmin').run(run);

    function run(
        $http,
        $rootScope,
        $location,
        $transitions,
        $state,
        authLoginService,
        statusFactory,
        toastr,
        $templateCache,
        DIRECTORY
    ) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';

        $http({
            url: DIRECTORY.SHARED + '/templates/pagination/pagination.tpl.html',
            method: 'GET',
        })
            .then(function (response) {
                $templateCache.put('pagination.tpl.html', response.data);
            })
            .catch(function (error) {
                toastr.error('Unable to load Pagination Template');
            });

        $transitions.onBefore({}, function (transition) {
            if (transition.to().secure) {
                return authLoginService.isLoggedIn().then(function (response) {
                    if (!response) {
                        return transition.router.stateService.target('simple.login');
                    }
                });
            }
            if (!transition.to().secure) {
                return authLoginService.isLoggedIn().then(function (response) {
                    if (response) {
                        toastr.info('Resuming Session');
                        return transition.router.stateService.target('admins.dashboard');
                    }
                });
            }
        });

        $transitions.onError({}, function (transition) {
            if (transition.error() && transition.error().detail) {
                if (transition.error().detail.status == statusFactory.UNAUTHORIZED) {
                    return transition.router.stateService.target('simple.login');
                }
            }
        });

        $transitions.onSuccess({}, function (transition) {
            $rootScope.pageTitle = transition.to().data.pageTitle;
        });
    }
});
