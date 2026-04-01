---
permalink: /
title: "Amirarsalan Rajabi's Homepage"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---




Bio
======
I am a Senior Machine Learning Engineer at Integral Ad Science, where I build and deploy large-scale LLM and vision-language systems — spanning distributed inference infrastructure, automated labeling pipelines, and production ML frameworks. I earned my Ph.D. from the University of Central Florida in December 2022, where I worked as a graduate research assistant at CASL.

---

Publications
======

{% if site.author.googlescholar %}
<div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
