
$(function(){

    var ID = 10;

    var Ware = function(id,name){
        this.id = id;
        this.name = name;
    };

    var BlRow = function(ware,quantity){

        this.ware = ware;
        this.quantity = quantity || 1;
        this.bought = false;

        var self = this;

        this.render = function() {

            $('#bl-list-root').append($(`
                <div class="bl-row" data-id="${this.ware.id}">
                    <div class="bl-product">
                        <span data-action="editName" class="name">${this.ware.name}</span>
                        <input data-action="saveName" class="hidden">
                    </div>
                    <div class="bl-count">
                        <button class="bl-substract tooltip" data-action="decrement" data-tooltip="minus">-</button>
                        <span class="bl-label">${this.quantity}</span>
                        <button data-tooltip="plus button"  data-action="increment" class="tooltip bl-plus">+</button>
                    </div>
                    <div class="bl-buttons">
                        <button class="tooltip" data-action="bought" data-tooltip="Тоoltip">Куплено</button>
                        <button class="bl-close tooltip" data-action="close" data-tooltip="close">x</button>
                    </div>
                </div>
            `));
            $(`[data-id="${this.ware.id}"]`).
                find('[data-action="decrement"]').click(function(){
                    self.decrementQuantity();
                }).
                end().
                find('[data-action="increment"]').click(function(){
                    self.incrementQuantity();
                }).
                end().
                find('[data-action="close"]').click(function(){
                    self.removeRow();
                }).
                end().
                find('[data-action="bought"]').click(function(){
                    self.toggleBought();
                }).
                end().
                find('[data-action="editName"]').click(function(){
                    $(this).addClass('hidden');
                    $(this).closest('.bl-product').
                        find('input').
                        removeClass('hidden').
                        val(self.ware.name).
                        focus();
                }).
                end().
                find('[data-action="saveName"]').blur(function(){
                    var newName = $(this).val();
                    if (!newName) return;
                    $(this).addClass('hidden');
                    self.ware.name = newName;
                    $(this).closest('.bl-product').find('span').html(newName).removeClass('hidden');
                    blBought.updateWare(self.ware);
                });
        };

        this.incrementQuantity  = function(){
            this.quantity++;
            $(`#bl-list-root [data-id="${this.ware.id}"]`).find('.bl-label').html(this.quantity);
        };

        this.decrementQuantity = function(){
            if (this.quantity===0) return;
            this.quantity--;
            $(`#bl-list-root [data-id="${this.ware.id}"]`).find('.bl-label').html(this.quantity);
        };

        this.removeRow = function(){
            $(`#bl-list-root [data-id="${this.ware.id}"]`).hide(100,function(){
                $(this).remove();
            })
        }

        this.toggleBought = function(){
            this.bought = !this.bought;
            $(`#bl-list-root [data-id="${this.ware.id}"]`).toggleClass("bought");
            if (this.bought) {
                blBought.removeRest(self.ware.id);
                blBought.addBought(self.ware,this.quantity);
            } else {
                blBought.addRest(self.ware, this.quantity);
                blBought.removeBought(self.ware.id);
            }
        }

    };

    var Bl = function(){

        this.rows = [];
        var self = this;

        this.addBlRow = function(row){
            this.rows.push(row);
            row.render();
        };

        var addWare = function(){
            var wareName = $('#wareName').val();
            if (!wareName) return;
            var ware = new Ware(ID++,wareName);
            self.addBlRow(new BlRow(ware,1));
            $('#wareName').val('').focus();
            blBought.addRest(ware,1);
        };

        $('[data-action="addWare"]').click(function(){
            addWare();
        });
        $('#wareName').keydown(function(e){
            if (e.keyCode===13) addWare();
        });

    };

    var BlBought = function(){


        this.addRest = function(ware,quantity){
            $('#rest-root').append($(`

                <div class="bl-rest-item" data-id="${ware.id}">
                    <span class="wareName">${ware.name}</span>
                    <div class="bl-rest-count">
                        ${quantity}
                    </div>
                </div>

            `));
        };

        this.addBought = function(ware,quantity){
            $('#bought-root').append($(`
                <div class="bl-rest-item" data-id="${ware.id}">
                    <span class="wareName">${ware.name}</span>
                    <div class="bl-rest-count through">
                        ${quantity}
                    </div>
                </div>

            `));
        };

        this.removeBought = function(id){
            $(`#bought-root [data-id="${id}"]`).remove();
        };

        this.updateWare = function(ware){
            $(`#rest-root [data-id="${ware.id}"] .wareName`).html(ware.name);
            $(`#bought-root [data-id="${ware.id}"] .wareName`).html(ware.name);
        };

        this.removeRest = function(id){
            $(`#rest-root [data-id="${id}"]`).remove();
        };


    };

    var blBought = new BlBought();

    var ware1 = new Ware(1,"Пломідори");
    var ware2 = new Ware(2,"Печиво");
    var ware3 = new Ware(3,"Сир");

    var bl = new Bl();
    bl.addBlRow(new BlRow(ware1,1));
    bl.addBlRow(new BlRow(ware2,1));
    bl.addBlRow(new BlRow(ware3,1));

    blBought.addRest(ware1,1);
    blBought.addRest(ware2,1);
    blBought.addRest(ware3,1);


});