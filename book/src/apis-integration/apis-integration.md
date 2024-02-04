# fa23.5: Web APIs and Integration Testing with Mocks

**These notes are being worked on; expect changes up until class.**

~~~admonish warning title="Server sprint is out!"
Server goes out today. **Do not wait to get started.** Start with integrating your CSV code with SparkJava (which we're covering today).
~~~


## Looking Ahead! 

In the next sprint, you'll be building a _server_ that listens for requests. It gets its data from your CSV files but also from other servers on the Internet. We anticipate some of the major challenges to be:
* setting the server up to listen properly (you'll use the _strategy pattern_ for this!);
* serializing and deserializing data to and from other servers and your user; 
* limited caching of prior results (you'll use the _proxy pattern_ for this!); and 
* _integration testing_ your server by sending it fake requests. 

## Livecode 

The [livecode for today](https://github.com/cs0320/class-livecode/tree/main/S24/feb08_nws_api) supplements the Server gearup example. We'll talk about:
* invoking (and creating) Web APIs; 
* integration testing; and 
* using "mocks" to avoid several different costs in development.

This example does *not* cover caching, which you'll need for the sprint. For that, see the previous livecode.

## Web APIs

There's a lot of useful information out there on the web. 

One way we might work with that info is to _scrape_ websites: write a script that interacts with the HTML on a webpage to extract the info.

### Why Not Web Scraping?

What are some weaknesses of web scraping, from the perspective of both the person doing the scraping, and the person who is running the website?

<details><summary><B>Think, then click!</B></summary>
    
A few issues might be:
* The owner of the data might want to charge for access in a fine-grained way, or limit access differently from the way it works on a webpage. 
* Web scraping is unstable. If a site's format changes, web-scraper scripts can break. APIs can have breaking changes too, but when they do, the changes usually come with a warning to users!
* Web scraping is mostly a one-sided effort. While a site designer might work to ease the job of web scrapers, details can still require some guesswork on the part of the script author.
</details>

### Web APIs

APIs work like this: the user sends a structured request to the API, which replies in a documented, structured way. API is short for _Application Programming Interface_, and often you'll hear the set of functions it provides to users called the "interface". 

This is an example of an "interface" in the broad, classical sense. It isn't a _Java_ `interface`. It's one of many ways for two programs to communicate across the web, but it's _specific_ and _well-defined_.

APIs are everywhere. Whenever you log in via Google (even on a non-Google site) you're using [Google's Authentication API](https://developers.google.com/identity). 

### Example: National Weather Service

Let's start right away with a serious, high-volume API: the U.S. National Weather Service. These APIs tend to be [well-documented](https://www.weather.gov/documentation/services-web-api). We'll use the NWS because, while many professional APIs require registration and the use of an API key to use them, the NWS API is free and requires no registration. 

The NWS API is not the exact API you will be using on the sprint, but I like it for demonstrating the same kind of interaction you'll need to implement.

Let's get weather information for Providence. Our geocordinates here are: `41.826820`, `-71.402931`. According to the docs, we can start by sending a `points` query with these coordinates: [https://api.weather.gov/points/41.8268,-71.4029](https://api.weather.gov/points/41.8268,-71.4029):

#### Queries 

There are a few things to notice right away. First, the URL we sent had a _host_ portion `(https://api.weather.gov`) and an _endpoint_ (called, confusingly, `points`) that represents the kind of query we're asking. Then there are _parameters_ to the query (`41.8268,-71.4029`). 

#### Responses

We get this back:

```
{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "s": "https://schema.org/",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#",
            "geometry": {
                "@id": "s:GeoCoordinates",
                "@type": "geo:wktLiteral"
            },
            "city": "s:addressLocality",
            "state": "s:addressRegion",
            "distance": {
                "@id": "s:Distance",
                "@type": "s:QuantitativeValue"
            },
            "bearing": {
                "@type": "s:QuantitativeValue"
            },
            "value": {
                "@id": "s:value"
            },
            "unitCode": {
                "@id": "s:unitCode",
                "@type": "@id"
            },
            "forecastOffice": {
                "@type": "@id"
            },
            "forecastGridData": {
                "@type": "@id"
            },
            "publicZone": {
                "@type": "@id"
            },
            "county": {
                "@type": "@id"
            }
        }
    ],
    "id": "https://api.weather.gov/points/41.8268,-71.4029",
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -71.402900000000002,
            41.826799999999999
        ]
    },
    "properties": {
        "@id": "https://api.weather.gov/points/41.8268,-71.4029",
        "@type": "wx:Point",
        "cwa": "BOX",
        "forecastOffice": "https://api.weather.gov/offices/BOX",
        "gridId": "BOX",
        "gridX": 64,
        "gridY": 64,
        "forecast": "https://api.weather.gov/gridpoints/BOX/64,64/forecast",
        "forecastHourly": "https://api.weather.gov/gridpoints/BOX/64,64/forecast/hourly",
        "forecastGridData": "https://api.weather.gov/gridpoints/BOX/64,64",
        "observationStations": "https://api.weather.gov/gridpoints/BOX/64,64/stations",
        "relativeLocation": {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.418784000000002,
                    41.823056000000001
                ]
            },
            "properties": {
                "city": "Providence",
                "state": "RI",
                "distance": {
                    "unitCode": "wmoUnit:m",
                    "value": 1380.4369590568999
                },
                "bearing": {
                    "unitCode": "wmoUnit:degree_(angle)",
                    "value": 72
                }
            }
        },
        "forecastZone": "https://api.weather.gov/zones/forecast/RIZ002",
        "county": "https://api.weather.gov/zones/county/RIC007",
        "fireWeatherZone": "https://api.weather.gov/zones/fire/RIZ002",
        "timeZone": "America/New_York",
        "radarStation": "KBOX"
    }
}
```

This _wasn't nicely formatted_ for human reading. Why? Because it's meant for programs to consume. This string should bear a remarkable resemblance to TypeScript objects. It's called Json: _JavaScript Object Notation_. When we write programs that work with web APIs, we'll never manually parse these, we'll use a library that does it for us. In general:
* when we're converting data or an object in our program to a format meant for transmission (like Json) we'll call it _serialization_; and
* when we're converting a transmission format (like Json) into data or an object in our program, we'll call it _deserialization_.

What else do you notice about this data? 

<details>
<summary>Think, then click!</summary>
    
One thing is: you can ignore a lot of it. This first query gives us useful information for _further_ uses of the API. Another is that there's no actual weather information here...
    
</details>
</br>

See the documentation to understand the meaning of specific fields in the response. At a high level, this query tells us _which NWS grid location_ Providence is in, along with telling us URLs for common queries about that grid location. The NWS API needs you to work with it in stages. 

## Building API Servers

The livecode example is an API server that sends requests to another API server:
* Someone sends our API server a request for the weather at a certain geolocation.
* Our API server asks the NWS what their grid coordinates are for that geolocation.
* Our API server asks the NWS for the forecast at that location. 
* Our API server responds to the original request, reporting the weather forecast.

### Setting up a server

We'll use a library called Sparkjava to run our API servers. Sparkjava is relatively simple to set up: we just tell it which port to use (here, `3232`), which endpoints to listen at, and for each, a handler object (there's the strategy pattern again!) that processes requests.

In the livecode for today, you'll see the entry point in the `Server.java` file. The code looks something like this:

```java
private final WeatherDatasource state = new NWSAPIWeatherSource();
Spark.port(port);
Spark.get("/weather", new WeatherHandler(state));
Spark.awaitInitialization();
```

In this case, the `WeatherHandler` object's constructor takes a _data source object_. Why do you think that is? 

<details>
<summary>Think, then click!</summary>
    
Extensibility and testing! If we added more handlers, we'd probably need to share some state between them. This sort of _dependency injection_ allows us to do just that. We might even wrap the datasource in a class that holds other kinds of state or other data sources.
    
</details>

Each of these handler classes handles queries sent to a specific endpoint. Here, queries to `weather` are handled by a `WeatherHandler` object.

You might notice that the data source being created is a `NWSAPIWeatherSource`, but it's being used only by an interface, `WeatherDatasource`. This enables some very useful techniques, including better testing. 

### Testing API Servers: Example of Integration Testing

Our philosophy is generally that you'll be able to test most everything you do, so as you start work on the Server sprint, you should be asking: **how can I test my API server?**

One way is to write unit tests. E.g., if we have a CSV data source (hint: you do!), we should have unit tests for that. If we have a source that goes to the National Weather Service to fetch forecasts, we should test that. 

But neither of those will test the _server_. How can we do that?

<details>
<summary>Think, then click!</summary>
    
Write a test class that starts up your server locally, sends it web requests, and evaluates the response. (This will all be done on your local computer; no internet connection needed.) 
    
</details>

This is exactly what the testing in the livecode demo does. When you're testing the _integration_ of multiple components in your application (such as our server tests) this is called _integration testing_. 

### Mocking (a remarkably powerful technique)

Consider what happens when I run the integration tests in the livecode. These generate web requests to our server, and then (assuming normal operation), our server will send a series of web requests to the NWS API. 

This is reasonable, but has a number of problems. What issues have I introduced into my testing because *running the tests requires the NWS API*?

<details>
<summary>Think, then click!</summary>
    
At the very least, the more I test (and I should test often!), the more I'll be spamming the NWS with requests. If I do it too much, they might think I am running a denial-of-service attack on them, and rate limit my requests. I also just can't run my test suite without an Internet connection, or if the NWS is down for maintenance. 
    
(There are other reasons, too.)
    
</details>

Hence the `MockedNWSAPISource` class, which implements the same interface that the _real_ data source class does. Instead of getting me the real forecast, however, it always returns a constant temperature. No NWS needed.

You'll use mocking in every sprint from now until the class is over; we've only barely discovered how important it is as a technique. And the patterns we have learned so far are perfect for implementing mocking well. To start with, a data source can be a strategy provided by the caller (real or mock). 

To see all this in action, **run the livecode**. Try the tests. Experiment with them. After the gearup, you'll have two examples to help you structure your Server sprint. 


<!-- 

## Fuzz Testing

Let's think about unit-testing on your CSV sprint. 

### Generating Test Inputs

What do you think is harder to think of: test _inputs_ or the corresponding _outputs_?

Usually it's the inputs that are harder, because they require clever thinking about the space of inputs. Outputs are often (although not always) an exercise in running the program in your mind.

Where else might we find test inputs, and what problems might occur with each source?

- someone else's tests? (same human biases, but ok, could help)
- monitor a real system (good idea; possibly different biases? overfitting to their use-case? may be ok, may not. could be expensive or affect performance.)
- random generation? (possibly a lot of weird values that aren't really reflective of reality, what's the distribution...?)

Let's build on the "random test generation" idea. Suppose we could randomly generate inputs. What could we do with them? 

The simplest, but still incredibly powerful, technique is to probe for crashes. Just keep feeding the system random inputs and, if your generator is good, you're likely to eventually find those bizarre corner cases that lead to surprising exceptions. 

You don't need to do this in JUnit, or have a `Test` annotation or anything like that. We're just experimenting with the idea of fuzzing.

### What's a "surprising exception"?

There's a bit of a caveat here. Sometimes programs are _supposed_ to throw an exception on certain inputs. Maybe the specification says that, "for input integers less than zero, the method throws `UnsupportedOperationException`". Then fuzzing is a bit more involved than trying to provoke _any_ exception. Instead, you might only look for exceptions like `NullPointerException` or other signals that indicate a bug, rather than a legitimate specified result.

### Takeaway

This might seem like a strange technique. But, in truth, it's used pretty commonly in industry where crash bugs are expensive, highly impactful, or affect many people. (Think: operating systems, device drivers, and cloud infrastructure, to name a few.) 

And, by the way: **not all the inputs need to be random!** You can still have deviously crafted inputs hard-coded; just include them at the beginning before you start random generation. This is true of everything else we do with random inputs.

Here's an example from my solution to CSV.  

```java
final static int NUM_TRIALS = 100;
final static int MAX_STARS = 100;

/**
 * The throws clause for this method is immaterial; JUnit will 
 * fail the test if any exception is thrown unless it's marked 
 * *expected* inside the @Test annotation or it's explicitly 
 * part of an assertion.
 */

@Test
public void fuzzTestStars() throws EndOfCSVException {
    for(int counter=0;counter<NUM_TRIALS;counter++) {
        // This helper produces a random CSV-formatted string
        // that contains a set of encoded Star objects
        String csvString = TestHelpers.getRandomStarCSV(MAX_STARS);
       
        // Note use of StringReader here, not FileReader
        // Allowing /any/ Reader makes testing easier.
        Reader csv = new StringReader(csvString);
        List<Star> stars = GenericCSVParser.parseFrom(csv, new StarFactory());

        // Fuzz testing -- just expect no exceptions, termination, ...
    }
}
```

We could improve this code in at least one big way. It's fixated on producing random CSV data for `Star` objects, and so we're not testing other kinds of random data. Still, **this actually found a bug in my parser while I was developing it: I wasn't properly handling the behavior of my parser iterator if the file was empty**.

-->

<!-- NOTE: removed MBT and kd-tree context, see Spring 2022 notes for this -->

<!-- ### Aside on Implementing Random Generators

In Java, I like to use `java.util.concurrent.ThreadLocalRandom`, since it lets me produce many different random types. E.g.:

```java
final ThreadLocalRandom r = ThreadLocalRandom.current();
long id = r.nextLong();
double x = r.nextDouble(Double.MIN_VALUE, Double.MAX_VALUE);
```

To generate random strings, we can generate a random array of bytes, and convert that to a string. E.g.:

```java
byte[] bytes = new byte[length];
r.nextBytes(bytes);
String name = new String(bytes, Charset.forName("UTF-8"));    
```

There's a limitation here. This does not guarantee an alpha-numeric string, or anything even remotely readable. Beware, since it might also contain control characters that will mess up some terminals if you print them! 

Moreover, since this string is UTF-8 encoded, it won't be able to contain most unicode characters, so we're focusing heavily on Latin characters. Fortunately, you can get more wide-ranging character sets with some quick changes. 

There's a "random testing" badge in 0320, so we'll be talking about this idea much more in the future. For now, keep in mind that not all tests need to be input-output pairs.

**QUICK DISCUSSION**: What's something you've written in _another_ class here at Brown that would be well-suited to fuzz testing?
 -->