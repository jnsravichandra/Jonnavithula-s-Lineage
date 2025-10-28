import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const stories = [
  {
    id: 1,
    title: "Featured Ancestors",
    description: "Your liec celius heriet taollinge",
    meta: "► BEC 4480",
    imageUrl: "https://via.placeholder.com/400x300/E7E1D8/2C3E50?text=Palace",
  },
  {
    id: 2,
    title: "Featured Ancesters",
    description: "Your lizer edðn hmst iessfiage",
    meta: "► BEC39 80",
    imageUrl: "https://via.placeholder.com/400x300/E7E1D8/2C3E50?text=Family",
  },
  {
    id: 3,
    title: "Featured Attonors",
    description: "Your Fiae salue kinet san liage",
    meta: "► BCC 845 30",
    imageUrl: "https://via.placeholder.com/400x300/E7E1D8/2C3E50?text=Village",
  },
];

function Home() {
  const { theme } = useTheme();

  const heroSection = () => {
    return (
      <>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: `calc(${theme.spacing["2xl"]} * 2) ${theme.spacing.lg}`,
            minHeight: "40vh",
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.sizes["5xl"],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.accentPrimary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Uncover Your Roots
          </h2>
          <Link to="/tree">
            <button
              style={{
                backgroundColor: theme.colors.accentPrimary,
                color:
                  theme.name === "light" ? "#FFFFFF" : theme.colors.textPrimary,
                border: "none",
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                borderRadius: theme.borderRadius,
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.medium,
                cursor: "pointer",
                transition: theme.transition,
              }}
            >
              Explore the Tree
            </button>
          </Link>
          <p
            style={{
              marginTop: theme.spacing.lg,
              color: theme.colors.textSecondary,
            }}
          >
            brief description
          </p>
        </section>
      </>
    );
  };

  const latestStories = () => {
    return (
      <>
        <section
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: `${theme.spacing["2xl"]} ${theme.spacing.xl}`,
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <h3
              style={{
                fontSize: theme.typography.sizes["4xl"],
                fontWeight: theme.typography.weights.bold,
                textAlign: "center",
                marginBottom: theme.spacing.sm,
              }}
            >
              Latest Stories
            </h3>
            <p
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing["2xl"],
              }}
            >
              Lor finuy fit eqreet tinef Pessligunt bikrengs
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: theme.spacing.xl,
              }}
            >
              {stories.map((story) => (
                <div
                  key={story.id}
                  style={{
                    backgroundColor: theme.colors.backgroundPrimary,
                    borderRadius: theme.borderRadius,
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: theme.transition,
                  }}
                >
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: theme.spacing.lg }}>
                    <h4
                      style={{
                        fontSize: theme.typography.sizes.xl,
                        fontWeight: theme.typography.weights.semibold,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      {story.title}
                    </h4>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      {story.description}
                    </p>
                    <p
                      style={{
                        color: theme.colors.accentPrimary,
                        fontWeight: theme.typography.weights.medium,
                      }}
                    >
                      {story.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      {heroSection()}
      {latestStories()}
    </>
  );
}

export default Home;
