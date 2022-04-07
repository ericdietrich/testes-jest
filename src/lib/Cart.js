import find from "lodash/find";
import remove from "lodash/remove";
import Dinero from 'dinero.js';

const calculatePercentageDiscount = (amount, {condition, quantity}) => {
  if (condition?.percentage &&
    quantity > condition.minimum ) {
    return amount.percentage(condition.percentage)
  }
  return Money({amount: 0})
}

const calculateQuantityDiscount = (amount, {condition, quantity}, price) => {
  if (quantity > condition.quantity) { 
    if (quantity % 2 === 0) {
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
    return this.items.reduce((acc, {quantity, product, condition}) => {
      const amount = Money({amount: quantity * product.price});
      
      let discount = Money({amount: 0})

      if(condition) {
        discount = calculeDiscount(amount, quantity, product.price, condition);
      }

      return acc.add(amount).subtract(discount)
    }, Money({amount: 0})).getAmount();
  }

  summary () {
    const formatter = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })


    const total = this.getTotal();
    const formatted = formatter.format(total);
    const items= this.items;

    return {
      total,
      formatted,
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
