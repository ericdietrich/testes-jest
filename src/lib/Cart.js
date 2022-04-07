import find from "lodash/find";
import remove from "lodash/remove";
import Dinero from 'dinero.js';

const calculatePercentageDiscount = (amount, item) => {
  if (item.condition?.percentage &&
    item.quantity > item.condition.minimum ) {
    return amount.percentage(item.condition.percentage)
  }
  return Money({amount: 0})
}

const calculateQuantityDiscount = (amount, item, price) => {
  if (item.quantity > item.condition.quantity) { 
    if (item.quantity % 2 === 0) {
      return amount.percentage(50)
    } else {
      return amount
              .subtract(Money({amount: price}))
              .percentage(50);
    }
  }
  return Money({amount: 0})
}

const calculeDiscount = (amount, quantity, price, condition) => {
  const list = Array.isArray(condition) ? condition : [condition];
  const [higherDiscount] = list.map(cond => {
    if (cond.percentage) {
      return calculatePercentageDiscount(amount, {condition: cond, quantity}).getAmount()
    } else if (cond.quantity) {
      return calculateQuantityDiscount (amount, {condition: cond, quantity}, price).getAmount()
    }
  }).sort((a,b) => b - a)
 return Money({amount : higherDiscount}) ;
}

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

export default class Cart {
  items = [];

  add(item) {
    const itemToFind = {product: item.product};
    if(find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }
    this.items.push(item);
  }

  remove (product) {
    remove(this.items, {product})
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      const amount = Money({amount: item.quantity * item.product.price});
      
      let discount = Money({amount: 0})

      if(item.condition) {
        discount = calculeDiscount(amount, item.quantity, item.product.price, item.condition);
      }

      return acc.add(amount).subtract(discount)
    }, Money({amount: 0})).getAmount();
  }

  summary () {
    const total = this.getTotal();
    const items= this.items;

    return {
      total,
      items
    }
  }

  checkout() {
    const {total, items} = this.summary()
    this.items = []

    return {
      total,
      items
    }
  }
}
