"use strict";
import angular from "angular";

function RouteCtrl(ApiService, AppAuth, $location) {
  $location.path("/app");
}

angular
  .module("com.module.core.controllers.router", [])
  .controller("RouteCtrl", RouteCtrl);
