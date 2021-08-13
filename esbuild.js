require("esbuild")
  .build({
    bundle: true,
    entryPoints: ["index.jsx"],
    outdir: "./build",
    jsxFactory: "h",
    jsxFragment: "Fragment",
    minify: true,
    sourcemap: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    },
  })
  .catch(() => process.exit(1));
