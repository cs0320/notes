# Security And Threat Modeling (All Too Briefly)

Today's notes are more of an outline. They are accompanied by the [slides](https://docs.google.com/presentation/d/12EreXpahlzzdT707pictF1hadaKqG9UtRndU1qvItB0/edit?usp=sharing).

## Taxis

Today's discussion: [Of Taxis and Rainbows](https://medium.com/vijay-pandurangan/of-taxis-and-rainbows-f6bc289679a1). There's also a corresponding [Hacker News thread](https://news.ycombinator.com/item?id=7926358).

(1) Let's talk about the core anonymization issue that the article reported on.
   - What's in the data, and what was anonymized?
   - What did they do to anonymize the data before release?
   - What went wrong? (how was the anon. circumvented?)
   - Is this attack a generally useful technique? for what?
   - What could have been done differently? 
   
(1) Takeaways: 
* True anonymization is hard, and it's difficult if not impossible to undo mistakes. 
* Often the interests of historians, social scientists, journalists and others may be competing with privacy interests. There is not always a single right answer, and there certainly isn't an absolute answer that is right for all such cases.
* When presented with such a situation in tech, think carefully. Seek advice if it's available on both the technical and non-technical angles. Here, the FOIA request was answered in *2 days*. 

(2) What could an adversary do with this data? 
   - What can they do by de-anonymizing the driver and taxi?
   - Don't get distracted by the anonymization issue! What about the _passengers_?
   - Is there any risk of correlation with other data?
   - Are there possible defenses? 

(3) Let's analyze this Hacker News exchange. There were 2 arguments I thought were interesting near the top:
  - "NYC is too dense for reasonable correlation"
  - "nobody who lives in a non-dense part of NYC can afford to take a taxi anyway"
   
New York City is a lot more than skyscrapers. It includes, say, Staten Island:

![](https://i.imgur.com/TYsQNas.png)
    
Here's a random Google street view:

![](https://i.imgur.com/bDID3iU.jpg)

    
Take Malte's 2390, Julia's 1952B, and other such courses if you think this sort of thing is interesting. Most importantly, if you think of "social implications" as a separate thing from engineering, stop. It's not always inseparable, but it frequently is. As with much else, there's nuance.

## Threat Modeling

There are a small set of [slides](https://docs.google.com/presentation/d/1GtXY7pU0c7iP-ab_JrlaHVMaPS_ckVBNPL6sdGDIDuY/edit?usp=sharing) to accompany today's notes.

What kinds of security threats are there? Are they always technical? How can engineers who aren't security experts (and taking one security class doesn't make you an expert) avoid gaps in their mental model of security?

I'd like to set the stage with two examples: one global and one local. 

### Example 1: The Parler Data Leak

Some time ago, hackers were able to [obtain nearly all data from the Parler website](https://www.wired.com/story/parler-hack-data-public-posts-images-video/). It turns out that this was technically pretty easy to do, because of a variety of engineering decisions. These included:
* insecure direct object references: post IDs were consecutive, and so a `for` loop could reliably and efficiently extract _every_ post on the site.
* no rate limiting: the above-mentioned `for` loop could run quickly.
* failure to scrub geo-location data from uploaded images: the physical location of users was compromised.

Combining multiple security mistakes tends to add up to more than the sum of the individual impacts. 

### Example 2: Phishing Email

Here's a screenshot of a real email someone received a couple of years ago.

![](https://i.imgur.com/mxbNDq4.png)

There was a lot more to follow, carefully crafted to trigger fear and loss aversion in the recipient. The sender claimed that they would toss the (salacious and embarrassing) information they had in exchange for a bit of money... in Bitcoin, of course.

This is an example of a _social engineering_ attack: no technical aspect of a system is compromised, but still its human or institutional facets can be hacked. Social engineering is pretty broad, but other examples include a hacker calling Google to reset your password, or a trojan-horse USB drive being left in a bank parking lot.

## Don't Forget the People Involved

Here's a classical experiment in psychology.

### Example 1

Suppose you're shown four cards. The deck these cards have been taken from have colors on one side (either yellow or red), and numbers (between 1 and 100) on the other. At first, you only see one side of each. Perhaps you see:

```
1
2
yellow
red
```

You're asked to determine if these four cards obey a simple rule: _if the card's number is even, then the card's color is red_. The question is, _which cards do you need to turn over to check the rule_?

### Example 2:

Suppose you're shown four cards. The deck these cards have been taken from have drink orders on one side (either juice or beer), and ages (between 1 and 100) on the other. At first, you only see one side of each. Perhaps you see:

```
beer
water
17
23
```

You're asked to determine if these four cards obey a simple rule: _if the drink order is alcoholic, then the age is no less than 21_. The question is, _which cards do you need to turn over to check the rule_?

### Psychological Context

These are called [Wason Selection Task]s(https://en.wikipedia.org/wiki/Wason_selection_task) and have been studied extensively in psychology. 

Surprisingly, humans tend to do poorly on the first task, but far better on the second. Why? Because context matters. If you can **catch someone outside of their security mindset** with an apparently rote task, you have a higher chance of exploiting them.

Good security involves far more than just the software. But whether or not we're talking about software or the human brain, bias can be attacked, and the attacker can abuse leaky abstractions.

## Aside: The GDPR

You may have heard of the [GDPR](https://gdpr.eu). On your term projects, it's a good idea to consider how you would comply with the law; we may ask (e.g.) how you would support deletion of a user's data (although we don't expect you to necessarily have time to implement your ideas).

Why should you care about laws like the GDPR? Setting aside ethical and empathetic concerns, if you ever intend to build software that's used in Europe, you ought to be aware of compliance requirements.

## Threat Modeling

We tend to think of security as being about confidentiality. But that's too limiting. Are there _other_ kinds of security goals you might want?

Here are 6 very broad classes of goal, which together comprise the S.T.R.I.D.E. framework:

### Authentication (vs. Spoofing)

### Integrity (vs. Tampering)

### Non-repuditation (vs. Repudiation)

### Confidentiality (vs. Information Disclosure)

### Availability (vs. Denial of Service)

### Authorization (vs. Elevation of Privilege)

## Elevation of Privilege

We're going to get practice with STRIDE using the cards by [Adam Shostack](https://adam.shostack.org) (a noted security expert) for a game called [Elevation of Privilege](https://github.com/adamshostack/eop). Adam is the author of my favorite book on threat modeling, which is [available in the Brown library](https://bruknow.library.brown.edu/permalink/01BU_INST/9mvq88/alma991043215908506966). I strongly recommend using this book as a guide to _mitigating_ the kinds of threats we'll identify today. 

Happily, this semester I have actual hard-copies of this game to use in class today. We won't have time to play the game, but I want to use them as props to think about potential threats your term projects will face. **Everyone should leave with at least one threat in mind.** 

<!-- ### Step 1: Diagramming

What would a diagram of the Sprint 3--4 application look like? Here's a general process to follow:
* Draw some vertexes that correspond to entitites where data is produced, consumed, held, processed, etc. The detail can be either coarse or fine, depending on our needs and our knowledge of the system. You might have vertexes for:
    * the database itself;
    * the database proxy;
    * the API handler; and
    * different aspects of the front-end app (e.g., the screenreader vs. the table view). 
* Draw edges between these vertexes that show how data flows, and label them with a short description of the data. For example:
    * table names flow from the front-end to the API handler.
    
Now, what kinds of _trust_ does each component need to perform its function? Does the database proxy trust the API handler implicitly? Then draw a circle around them, linking them into the same "zone of trust". (The trust doesn't have to absolute! The point is to identify lack of boundaries that an attacker could exploit.)

The slides contain 2 examples of this from Shostack's book. 

#### Important Aside

The goal of this lecture isn't to "teach you to do proper threat modeling". That would take more than the half-hour or so we have for this section. Rather, I want to give you a taste of the discipline in the hope it's useful on your term projects. 

If you're planning on specializing (or even sometimes engaging with) security concerns, you'd do well to explore the threat-modeling book and take other security-focused classes. 

**Which category does threat-modeling fall into?** Design is most likely. Depending on what you do with it, you might also be able to make an argument for testing or professionalism.

### Step 2: Looking For Threats

If we were building the system, would we have any spoofing concerns? What about availability? Etc. Remember, you're not looking for _bugs_; you're looking for _potential threats_. Some are easy to avoid or mitigate, others are challenging, and still others may be impossible (or at least prohibitively expensive to avoid). Also, remember that the attacker may be after something other than _your_ data: are there things about your system that might make it useful as a vector of attack?

To avoid issues caused by diagramming differences, and keep things simple, we'll use the company dataflow diagram from Shostack (slide 9). Where detail is missing, allow yourself to think in hypotheticals. E.g., what _if_ the attacker could get a directory listing, and learn about filenames on the human-resources server?

Now we get to play the game! Form groups, and play. The classroom isn't well-suited to this, but let's make it work---focus on thinking through different kinds of threats.

**While the game is going on, and until the end of "class", Tim is available in the front of class to answer questions you have about Sprint 4 or the term project.**


### Some Possible Threats:

Here are some examples (not at all exhaustive), mostly taken from the book:

<details>
<summary>Think, then click!</summary>
* The web client could connect to a spoofed front-end.
* Someone could tamper with a request en route to the DB server.
* Someone might send many consecutive expensive SQL requests.
* The logs could fill up.
* If the database can run arbitrary commands, then the client gains access to them as well.
</details> -->