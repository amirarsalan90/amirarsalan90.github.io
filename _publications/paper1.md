---
title: "Fair Bilevel Neural Network (FairBiNN): On Balancing Fairness and Accuracy via Stackelberg Equilibrium"
collection: publications
permalink: /publication/FairBiNN
featured: true
excerpt: 'This paper addresses the persistent challenge of bias in machine learning models, proposing a bilevel optimization approach that balances fairness and accuracy.'
date: 2024-12-01
venue: 'Advances in Neural Information Processing Systems (NeurIPS 2024)'
venue_short: 'NeurIPS 2024'
authors: 'Mehdi Yazdani-Jahromi, Ali Khodabandeh Yalabadi, **Amirarsalan Rajabi**, Aida Tayebi, Ivan Garibay, Ozlem Ozmen Garibay'
tldr: 'Fairness and accuracy are treated as two players in a Stackelberg game, each owning its own layers of one network. The bilevel solution is provably no worse than the usual Lagrangian (regularization) approach, and in practice it reaches a better accuracy–fairness trade-off.'
teaser: /images/papers/fairbinn/architecture.png
animation: fairbinn
paperurl: 'https://proceedings.neurips.cc/paper_files/paper/2024/hash/bef7a072148e646fcb62641cc351e599-Abstract-Conference.html'
links:
  paper: 'https://proceedings.neurips.cc/paper_files/paper/2024/hash/bef7a072148e646fcb62641cc351e599-Abstract-Conference.html'
  arxiv: 'https://arxiv.org/abs/2410.16432'
  code: 'https://github.com/yazdanimehdi/FairBiNN'
citation: 'Yazdani-Jahromi, M., Khodabandeh Yalabadi, A., Rajabi, A., Tayebi, A., Garibay, I., & Garibay, O. (2024). Fair Bilevel Neural Network (FairBiNN): On Balancing fairness and accuracy via Stackelberg Equilibrium. Advances in Neural Information Processing Systems, 37, 105780-105818.'
bibtex: |
  @inproceedings{yazdanijahromi2024fairbinn,
    title     = {Fair Bilevel Neural Network (FairBiNN): On Balancing Fairness and Accuracy via Stackelberg Equilibrium},
    author    = {Yazdani-Jahromi, Mehdi and Khodabandeh Yalabadi, Ali and Rajabi, Amirarsalan and Tayebi, Aida and Garibay, Ivan and Ozmen Garibay, Ozlem},
    booktitle = {Advances in Neural Information Processing Systems},
    volume    = {37},
    pages     = {105780--105818},
    year      = {2024}
  }
---

## Abstract

The persistent challenge of bias in machine learning models necessitates robust solutions to ensure parity and equal treatment across diverse groups, particularly in classification tasks. Current methods for mitigating bias often result in information loss and an inadequate balance between accuracy and fairness. To address this, we propose a novel methodology grounded in bilevel optimization principles. Our deep learning-based approach concurrently optimizes for both accuracy and fairness objectives, achieving Pareto optimal solutions while mitigating bias in the trained model. Theoretical analysis shows that the upper bound on the loss incurred by this method is less than or equal to the loss of the Lagrangian approach. We demonstrate the efficacy of our model on tabular datasets such as UCI Adult and Heritage Health, outperforming state-of-the-art fairness methods.

## Method

{% include figure.html img="/images/papers/fairbinn/architecture.png" caption="The FairBiNN architecture. The accuracy player's layers (θ<sub>a</sub>) are trained on binary cross-entropy. A block of fairness layers (θ<sub>f</sub>) inside the network is trained separately on a demographic-parity loss, with its own optimizer." %}

The accuracy player is the *leader*: it solves the upper-level problem, taking into account how the fairness player will respond. The fairness player is the *follower*: it minimizes the fairness loss given the leader's parameters. Training alternates between the two updates. Under the paper's assumptions, the resulting Stackelberg equilibrium is Pareto optimal, and its loss is bounded by that of the Lagrangian formulation.

## Results

<div class="paper__pair">
{% include figure.html img="/images/papers/fairbinn/adult_compare.png" caption="(a) UCI Adult" %}
{% include figure.html img="/images/papers/fairbinn/health_compare.png" caption="(b) Heritage Health" %}
</div>
<p class="paper__pair-caption">Accuracy compared with statistical demographic parity for FairBiNN (red diamonds) and benchmark methods. The best region is the bottom right: high accuracy and low parity difference. FairBiNN gives the best trade-off on both datasets.</p>

<div class="paper__pair">
{% include figure.html img="/images/papers/fairbinn/tsne_without.jpg" caption="(a) Without the fairness layers, z" %}
{% include figure.html img="/images/papers/fairbinn/tsne_with.jpg" caption="(b) With the fairness layers, z̃" %}
</div>
<p class="paper__pair-caption">CelebA (target: <i>Attractive</i>): t-SNE of the representation, colored by gender. With the fairness layers, the representation no longer clusters by gender.</p>
