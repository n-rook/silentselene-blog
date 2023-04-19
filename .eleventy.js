
const {DateTime} = require('luxon');

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const eleventy = require("@11ty/eleventy");
const sass = require("sass");

// Thanks to https://github.com/11ty/eleventy-base-blog
// for providing a lot of inspiration!

module.exports = function(config) {
    config.addPassthroughCopy("static");

    config.addPlugin(pluginRss);
    config.addPlugin(pluginBundle);
    config.addPlugin(pluginNavigation);
    config.addPlugin(eleventy.EleventyHtmlBasePlugin);

    config.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

    config.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

    config.addExtension("sass", {
        outputFileExtension: "css",

        compile: async function(inputContent) {
            const result = sass.compileString(
                inputContent,
                {
                    syntax: 'indented'
                });
            return async (data) => result.css;
        }
    });

    return {
        dir: {
            input: "content",
            includes: "../_includes",
            data: "../_data",
            output: "_site",
        },

		markdownTemplateEngine: "njk",

		htmlTemplateEngine: "njk",

        templateFormats: ["html", "md", "njk", "sass"],

        pathPrefix: "/",
    }
}
