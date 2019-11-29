module.exports = {
  postPayment : function (ctx, cb){
    var stripe = require('stripe')('sk_test_G2P7ltoEojtsN7iML12LVHBw00WLZ6l6Nv');

    const token = ctx.body.stripeToken; // Using Express
    const price = ctx.body.stripePrice;
    // console.log("price" + price);

    const charge = stripe.charges.create({
      amount: price,
      currency: 'gbp',
      description: ctx.body.item ,
      source: token,
    }, function(err, paid_order){
      cb(paid_order, { paid_order: paid_order || err});
    });
  }
};
