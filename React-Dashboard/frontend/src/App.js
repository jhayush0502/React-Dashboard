import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, CssBaseline } from '@material-ui/core';
import { Dashboard as DashboardIcon, ShoppingCart as ShoppingCartIcon, People as PeopleIcon } from '@material-ui/icons';
import axios from 'axios';
import { Chart,LinearScale,BarController,CategoryScale,BarElement } from 'chart.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  chartContainer: {
    marginTop: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  let chartRef = React.createRef();

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedSection === 'Orders' && orders.length > 0) {
      renderBarChart();
    }
  }, [selectedSection, orders]);

  const fetchOrders = () => {
    axios.get('http://localhost:8000/api/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  const fetchCustomers = () => {
    axios.get('http://localhost:8000/api/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'Dashboard':
        return (
          <Typography paragraph>
            Welcome to the dashboard! Here you can view various statistics and information about your application.
          </Typography>
        );
      case 'Orders':
        return (
          <div>
            <Typography paragraph>
              You have {orders.length} new orders. Click here to view the details.
            </Typography>
            <div className={classes.chartContainer}>
              <canvas ref={chartRef} />
            </div>
            {orders.map((order) => (
              <div key={order.id}>
                <Typography variant="h6">{order.customer}</Typography>
                <Typography paragraph>Total: ${order.total}</Typography>
              </div>
            ))}
          </div>
        );
      case 'Customers':
        return (
          <div>
            <Typography paragraph>
              You have {customers.length} new customers. Click here to view the details.
            </Typography>
            {customers.map((customer) => (
              <div key={customer.id}>
                <Typography variant="h6">{customer.name}</Typography>
                <Typography paragraph>Email: {customer.email}</Typography>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderBarChart = () => {
    const labels = orders.map((order) => order.customer);
    const amounts = orders.map((order) => order.total);
  
    Chart.register(LinearScale, BarController, BarElement,CategoryScale);
  
    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Order Amount',
            data: amounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
    };
  
    new Chart(chartRef.current, chartConfig);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <List>
          <ListItem button selected={selectedSection === 'Dashboard'} onClick={() => handleSectionClick('Dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button selected={selectedSection === 'Orders'} onClick={() => handleSectionClick('Orders')}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button selected={selectedSection === 'Customers'} onClick={() => handleSectionClick('Customers')}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {renderSectionContent()}
      </main>
    </div>
  );
};

export default Dashboard;
