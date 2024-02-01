### NOTE ### 

# on sending file by POST

Error: {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"":["Failed to read the request form. Missing content-type boundary."]},"traceId":"00-d7a353acf9c121346dddc4f7ce445ff9-82ec754156e6f6ca-00"}

Solution: Remove the content-type in headers of fetch


# Installing pdf viewer

Links: https://react-pdf-viewer.dev/plugins/

Dependecies:
    npm install pdfjs-dist@3.4.12
    npm install @react-pdf-viewer/core@3.12.0
    npm install '@react-pdf-viewer/default-layout'

Errors:
1. Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)

Solution: Include

    webpack: (config) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    },

Into the next.config.js

