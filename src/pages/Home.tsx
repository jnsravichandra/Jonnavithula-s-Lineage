import Logo from "../assets/Logo1-nobackground.png";
import { Link } from "react-router-dom";
import { SampleData } from "../data/Sample_Data";

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
              backgroundSize: "70%",
            }}
          ></div>
          {/* Content */}
          <div className="relative flex flex-col items-center gap-lg">
            <h1 className="text-5xl font-heading font-bold text-accent-primary">
              Uncover Your Roots
            </h1>
            <Link to="/tree">
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
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-lg">
            Latest Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {/* Placeholder Story Cards */}
            {SampleData.storiesList.map((story, index) => (
              <div
                key={index}
                className="bg-background-primary p-md rounded-md shadow-sm min-h-[200px] border-accent-secondary"
              >
                <h3 className="text-xl font-bold text-accent-primary mb-sm">
                  {story.title}
                </h3>
                <p className="text-text-secondary">
                  {story.content.slice(0, 100)}
                  {story.content.length > 100 && "..."}
                </p>
              </div>
            ))}
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
    <div className="space-y-2xl">
      {HeroSection()}
      {LatestStoriesSection()}
    </div>
  );
}

export default Home;
