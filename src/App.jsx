import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';
import catalogData from './data.json';
import './bootstrap.min.css';
import './App.css';

const styles = {
  search: {
    width: '100%',
    // boxSizing: border-box,
    border: 'none',
    borderBottom: '2px solid #ccc',
    fontSize: '12px',
    // borderRadius: '4px',
    backgroundColor: 'white',
    backgroundImage: "url('http://w3schools.com/howto/searchicon.png')",
    backgroundPosition: '10px 10px',
    backgroundRepeat: 'no-repeat',
    padding: '12px 20px 12px 40px'
  },
  body: {
    color: 'rgb(99, 99, 99)'
  },
  favourites: {
    list: {
      height: 'auto',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap'
    },
    foodItem: {
      base: {
        width: '200px'
      }
    },
    base: { padding: '10px', overflowX: 'auto', position: 'relative' },
    header: {
      textAlign: 'left',
      marginTop: '5px',
      marginBottom: '5px',
      fontSize: '14px'
    },
    subText: {
      color: 'rgb(142, 142, 142)',
      fontSize: '12px',
      margin: 0,
      textAlign: 'left'
    }
  },
  categories: {
    foodItem: {
      base: {
        width: '100%',
        maxWidth: '300px'
      }
    }
  },
  cart: { position: 'absolute', right: '10px', top: '10px' },
  foodItems: {
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap'
  },
  header: {
    height: '45px',
    background: 'green',
    color: 'white',
    padding: '10px'
  },
  scrollmenu: {
    base: {
      height: 'auto',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap'
    },
    image: { width: '30px', marginRight: '5px' },
    a: {
      display: 'inline-block',
      // color: white,
      textAlign: 'center',
      padding: '14px',
      color: 'black',
      textDecoration: 'none'
    }
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      selectedIndex: {},
      catalogData,
      favouriteItems: catalogData.recipes || {},
      filterItems: catalogData.recipes || {}
    };
    this.selectCategory = this._selectCategory.bind(this);
    this.filterOnChange = this._filterOnChange.bind(this);
    this.addToBag = this._addToBag.bind(this);
  }

  componentDidMount() {
    let self = this;
    axios
      .get('http://temp.dash.zeta.in/food.php')
      .then(function(response) {
        console.log(response.data);
        self.setState({
          catalogData: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  _selectCategory(e, category, index) {
    console.warn(category);
    e.preventDefault();
    let result = catalogData.recipes.filter(item => {
      return item.category === category;
    });
    this.setState({ filterItems: result });
    this.setState({ selectedIndex: index });
    document.getElementById('scrollMenu').scrollIntoView();
  }
  _addToBag(e, item) {
    let cart = this.state.cart;
    cart.push(item);
    this.setState({ cart });
  }
  _filterOnChange(e) {
    let result = catalogData.recipes.filter(item => {
      return item.name.startsWith(e.target.value);
    });
    if (!e.target.value) {
      this.setState({ filterItems: catalogData.recipes });
    } else {
      this.setState({ filterItems: result });
    }
  }
  render() {
    const { categories, scrollmenu, favourites } = styles;
    const { catalogData, filterItems, favouriteItems } = this.state;
    let self = this;
    return (
      <div style={styles.body} className="App">
        <header style={styles.header}>Best Food App</header>
        <Grid>
          <section style={favourites.base}>
            <h6 style={favourites.header}>Favourites</h6>
            <span style={styles.cart}>
              <span class="badge" id="lblCartCount">
                <i class="fa badge" style={{ fontSize: '24px' }} value="5">
                  &#xf07a;
                </i>
                {this.state.cart.length}{' '}
              </span>
            </span>

            <p style={favourites.subText}>Enjoy what you have been ordering</p>
            <div style={favourites.list}>
              {filterItems.map(item => {
                return (
                  <FoodItem
                    width={favourites.foodItem.base}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    cart={self.state.cart}
                  />
                );
              })}
            </div>
            {/* <Row className="show-grid">
              <Col xs={12} md={8} />
            </Row> */}
          </section>

          <input
            style={styles.search}
            type="text"
            name="search"
            onChange={e => this.filterOnChange(e)}
            placeholder="Search.."
          />
          <br />
          <br />
          <h6 style={favourites.header}>Select Catagories</h6>
          <div style={scrollmenu.base} id="scrollMenu" className="scrollmenu">
            {catalogData.categories.map((item, index) => {
              return (
                <a
                  style={scrollmenu.a}
                  key={index}
                  className={
                    this.state.selectedIndex === index ? 'activeMenu' : ''
                  }
                  onClick={e => this.selectCategory(e, item.name, index)}
                  href="#disabled"
                >
                  <Image style={scrollmenu.image} src={item.image} rounded />
                  {item.name}
                </a>
              );
            })}
          </div>
          <section id="foodItems">
            {filterItems.map(item => {
              return (
                <FoodItem
                  width={categories.foodItem.base}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  buttonName="ADD TO BAG"
                  cart={self.state.cart}
                  action={e => this.addToBag(e, item)}
                />
              );
            })}
          </section>
        </Grid>
      </div>
    );
  }
}
const FoodItem = ({
  width,
  buttonName = 'REORDER',
  price = '150',
  name = 'Breakfast Platter',
  image,
  action,
  cart
}) => {
  const styles = {
    base: {
      maxWidth: '300px',
      fontSize: '12px',
      margin: '10px',
      marginLeft: 0,
      display: 'inline-block',
      width: width.width
    },
    itemName: {
      float: 'left',
      textAlign: 'left',
      fontWeight: 600,
      width: '55%',
      overflow: 'hidden'
    },
    image: {
      width: width.width,
      marginBottom: '10px'
    },
    button: {
      float: 'right',
      fontSize: '10px'
    }
  };

  let cartCount = cart.filter(item => {
    return item.name === name;
  }).length;
  return (
    <div style={styles.base}>
      <Image style={styles.image} src={image} rounded />
      <p style={styles.itemName}>{name}</p>
      <Button onClick={() => action()} style={styles.button} bsStyle="success">
        {cartCount ? '(' + cartCount + ')' : ''} {buttonName}
      </Button>
      <div className="clearfix" />
    </div>
  );
};

export default App;
