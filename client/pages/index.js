const LandingPage = ({ color }) => {
  console.log('I am in the component', color);
  return <div>LandingPage</div>;
};

LandingPage.getInitialProps = () => {
  console.log('I am on a server ');
  return { color: 'red' };
};

export default LandingPage;
