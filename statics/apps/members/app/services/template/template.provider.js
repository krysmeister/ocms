define(['appMember'], function () {
    'use strict';

    angular.module('appMember').provider('$template', TemplateProvider);

    function TemplateProvider(DIRECTORY) {
        this.$get = function () {
            return {};
        };

        this.getShared = function (name) {
            return DIRECTORY.SHARED + '/templates' + '/' + name + '/' + name + '.tpl.html';
        };
    }
});
