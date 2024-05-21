import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <div>LandingPage</div>;
};

/*we created useRequest hook to make it really easy to make some kind of request and possibly handle
any errors that might occur.
The reason for this is that useRequest is a hook and hooks are used inside of react components.
Get initial props right here is not a component. It is a plane function.*/

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server!
    // requests should be made to http://ingress-nginx-controller_____blah blah
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers
      }
    );
    return data;
  } else {
    // we are on the browser!
    // requests can be made with a base url
    const { data } = await axios.get('/api/users/currentuser');
    return data;
  }

  return {};
};

export default LandingPage;
