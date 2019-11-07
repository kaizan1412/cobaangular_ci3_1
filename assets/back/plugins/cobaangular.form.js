var app = angular.module("app", ['ngValidate']).config(function($validatorProvider) {
        $validatorProvider.setDefaults({
            errorElement: 'span',
            errorClass: 'help-block text-danger'
        });
    });
    app.controller("dataController", function($scope, $http) {

        $scope.validationOptions = {
            rules: {
                title: {
                    required: true
                },
                description: {
                    required: true
                }
            },
            messages: {
                title: {
                    required: "title required"
                },
                description: {
                    required: "description required"
                }
            }
        };

        $scope.showdata = function() {

            $http.get(base_url + 'get_data', {}).then(function post(response) {

                $scope.curPage = 0;
                $scope.pageSize = 6;

                $scope.post = response.data;

                $scope.numberOfPages = function() {
                    return Math.ceil($scope.post.length / $scope.pageSize);
                };

            });

        }

        $scope.findValue = function(enteredValue) {
            $http.get(base_url + 'get_search/' + enteredValue, {}).then(function post(response) {

                $scope.curPage = 0;
                $scope.pageSize = 6;

                $scope.post = response.data;
                $scope.numberOfPages = function() {
                    return Math.ceil($scope.post.length / $scope.pageSize);
                };

            });
        };

        $scope.delete = function($id) {
            $http.get(base_url + 'delete/' + $id).
            then(function(data) {
                //either this
                console.log(data);
                $scope.showdata();
                //or this
                swal({
                    type: 'success',
                    title: 'proses berhasil',
                    text: 'menghapus data',
                    confirmButtonText: 'tutup'
                })
            });
        }

        $scope.edit = function($id) {
            $http.get(base_url + 'get_id/' + $id, {}).then(function form(response) {
                //either this
                console.log(response.data);
                $scope.form = response.data;
                //or this
            });
        }

        $scope.saveEdit = function() {
            if ($scope.editItem.validate()) {
                $http({
                    method: 'post',
                    url: base_url + 'edit/' + $scope.form.id,
                    data: $scope.form, //forms testi object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(data) {
                    //either this
                    $(".modal").modal("hide");
                    $scope.showdata();
                    //or this
                    swal({
                        type: 'success',
                        title: 'proses berhasil',
                        text: 'ubah data',
                        confirmButtonText: 'tutup'
                    })
                });
            }
        }

        $scope.delete_check = function(list) {
            var itemList = [];
            angular.forEach(list, function(value, key) {
                if (list[key].selected) {
                    itemList.push(list[key].selected);
                }
            });
            //console.log(itemList.length);
            $http.post(base_url + 'delete_check_data/', itemList).
            then(function(data) {
                //either this
                $scope.showdata();
                //or this
                swal({
                    type: 'success',
                    title: 'proses berhasil',
                    text: 'menghapus data',
                    confirmButtonText: 'tutup'
                })
            });
        }

        $scope.data = {
            title: '',
            description: ''
        };

        $scope.resetForm = function() {
            $scope.data = {};
        };

        $scope.data = {};

        $scope.submitForm = function() {

            if ($scope.myForm.validate()) {
                $http({
                    method: 'post',
                    url: base_url + 'add',
                    data: $scope.data, //forms testi object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(data) {
                    //either this
                    $scope.showdata();
                    $scope.data = {};
                    $scope.showme = false;
                    //or this
                    swal({
                        type: 'success',
                        title: 'proses berhasil',
                        text: 'buat data baru',
                        confirmButtonText: 'tutup'
                    })
                });
            }
        }
    });

    app.filter('pagination', function() {
        return function(input, start) {
            if (!input || !input.length) {
                return;
            }
            start = +start; //parse to int
            return input.slice(start);
        }
    });