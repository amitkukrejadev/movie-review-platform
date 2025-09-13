// inside fetchTrending() before fetch...
        console.log(
          "useMovies: TMDB_BASE:",
          TMDB_BASE,
          "TMDB_KEY present:",
          !!TMDB_KEY
        );
        console.log("useMovies: fetching URL ->", url);