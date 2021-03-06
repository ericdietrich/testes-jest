import Cart from './Cart';

describe('Cart', () => {
  let cart;
  let product = {
    title: 'Adidas running shoes - men',
    price: 35388, // 353.88 | R$383,88
  }
  let product2 = {
    title: 'Adidas running shoes - women',
    price: 41872, // 418.72 | R$418,72
  }

  //before each test(it)
  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal()).toEqual(0);
    });
  
    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2, // 70776
      };
  
      cart.add(item);
  
      expect(cart.getTotal()).toEqual(70776);
    });
  
    it('should ensure no more than one product exists at a time', () => {
      cart.add({
        product,
        quantity: 2, 
      });
  
      cart.add({
        product,
        quantity: 1, 
      });
  
      expect(cart.getTotal()).toEqual(35388);
    });
  
    it('should update total when a product gets included and then removed', () => {
      cart.add({
        product,
        quantity: 2, 
      });
  
      cart.add({
        product: product2,
        quantity: 1, 
      });
  
      cart.remove(product)
  
      expect(cart.getTotal()).toEqual(41872);
    });
  });

  describe('checkout()', () => {  
    it('should return an object with the total and the list of the items', () => {
      cart.add({
        product,
        quantity: 2, 
      });
  
      cart.add({
        product: product2,
        quantity: 1, 
      });

      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should return an object with the total and the list of the items when summary is called', () => {
      cart.add({
        product,
        quantity: 2, 
      });
  
      cart.add({
        product: product2,
        quantity: 1, 
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal()).toBeGreaterThan(0);
    });

    it('should include formatted amount in the summary', () => {
      cart.add({
        product,
        quantity: 2, 
      });
  
      cart.add({
        product: product2,
        quantity: 1, 
      });
      expect(cart.summary().formatted).toBe("R$\xa0112.648,00");
    });

    it('should should reset the cart when checkout is called', () => {
      cart.add({
        product: product2,
        quantity: 3, 
      });
      cart.checkout()

      expect(cart.getTotal()).toEqual(0);
    });
  });

  describe('special conditions', () => {
    it('should apply percent discount when quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal()).toEqual(74315);

    });

    it('should NOT apply percent discount when quantity bellow or equal to minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 3,
      }

      cart.add({
        product,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal()).toEqual(106164);

    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2
      }

      cart.add({
        product,
        condition,
        quantity: 4,
      })

      expect(cart.getTotal()).toEqual(70776);

    });

    it('should NOT apply quantity discount for even quantities when condition is not met', () => {
      const condition = {
        quantity: 3
      }

      cart.add({
        product,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal()).toEqual(106164);

    });

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2
      }
      cart.add({
        product,
        condition,
        quantity: 7,
      })
      expect(cart.getTotal()).toEqual(141552);

      cart.remove(product)

      cart.add ({
        product: product2,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal()).toEqual(83744);

    });

    it('should receive two or more conditions and determine/apply the best discount. First case', () => {
      const condition1 = {
        percentage: 30,
        minimum: 3,
      }
      const condition2 = {
        quantity: 2
      }
      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5,
      });

      expect(cart.getTotal()).toEqual(106164)
    });

    it('should receive two or more conditions and determine/apply the best discount. Second case', () => {
      const condition1 = {
        percentage: 80,
        minimum: 2,
      }
      const condition2 = {
        quantity: 2
      }
      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5,
      });

      expect(cart.getTotal()).toEqual(35388)
    });

  })
});
