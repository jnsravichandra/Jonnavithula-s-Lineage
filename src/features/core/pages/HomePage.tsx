import Logo from '../../../assets/Logo1-nobackground.png';
import { Link } from 'react-router-dom';

function Home() {
  
  const HeroSection = () => {
   
    return (
      <>
        {/* Hero Section */}
        <section className="relative flex flex-col justify-center items-center text-center min-h-[500px] py-2xl mb-0">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: `url(${Logo})`,
              backgroundSize: '70%',
            }}
          ></div>
          {/* Content */}
          <div className="relative flex flex-col items-center gap-lg">
            <h1 className="text-5xl font-heading font-bold text-accent-primary">Uncover Your Roots</h1>
            <Link to="/family-tree">
              <button className="bg-accent-primary text-background-primary font-semibold text-lg py-md px-xl rounded-xl hover:bg-opacity-80 transition-colors duration-300">
                Explore the Tree
              </button>
            </Link>
          </div>
        </section>
      </>
    );
  };

  const LatestStoriesSection = () => {
    return (
      <>
        {/* Latest Stories Section */}
        <section className="bg-background-secondary min-h-[300px] p-md rounded-2xl ">
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-lg">Latest Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {/* Placeholder Story Cards */}

            {/* { Add more Stories } */}
            <div className="flex items-center">
              <Link to="/stories">
                <button className="bg-accent-primary text-background-primary font-semibold text-lg py-md px-xl rounded-xl hover:bg-opacity-80 transition-colors duration-300">
                  Add More Stories
                </button>
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="p-md space-y-2xl">
      {HeroSection()}
      {LatestStoriesSection()}
    </div>
  );
}

export default Home;
