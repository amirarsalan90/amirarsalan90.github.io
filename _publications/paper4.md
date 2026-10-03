---
title: "TabFairGAN: Fair Tabular Data Generation with Generative Adversarial Networks"
collection: publications
permalink: /publication/TabFairGAN
featured: true
excerpt: 'A Wasserstein GAN that first learns to generate realistic tabular data, then is fine-tuned to generate data that is also fair.'
date: 2022-01-01
venue: 'Machine Learning and Knowledge Extraction'
venue_short: 'MAKE 2022'
authors: '**Amirarsalan Rajabi**, Ozlem Ozmen Garibay'
tldr: 'A Wasserstein GAN trained in two phases: first to reproduce the joint distribution of a tabular dataset, then with a fairness term added to the generator loss. The result is synthetic data with demographic parity nearly removed and utility largely kept.'
teaser: /images/papers/tabfairgan/architecture.png
animation: tabfairgan
paperurl: 'https://doi.org/10.3390/make4020022'
links:
  paper: 'https://doi.org/10.3390/make4020022'
  arxiv: 'https://arxiv.org/abs/2109.00666'
  code: 'https://github.com/amirarsalan90/TabFairGAN'
citation: 'Rajabi, A., & Garibay, O. O. (2022). TabFairGAN: Fair tabular data generation with generative adversarial networks. Machine Learning and Knowledge Extraction, 4(2), 488-501.'
bibtex: |
  @article{rajabi2022tabfairgan,
    title   = {TabFairGAN: Fair Tabular Data Generation with Generative Adversarial Networks},
    author  = {Rajabi, Amirarsalan and Ozmen Garibay, Ozlem},
    journal = {Machine Learning and Knowledge Extraction},
    volume  = {4},
    number  = {2},
    pages   = {488--501},
    year    = {2022},
    doi     = {10.3390/make4020022}
  }
---

## Abstract

With the increasing reliance on automated decision making, the issue of algorithmic fairness has gained increasing importance. In this paper, we propose a Generative Adversarial Network for tabular data generation. The model includes two phases of training. In the first phase, the model is trained to accurately generate synthetic data similar to the reference dataset. In the second phase we modify the value function to add fairness constraint, and continue training the network to generate data that is both accurate and fair. We test our results in both cases of unconstrained, and constrained fair data generation. In the unconstrained case, i.e. when the model is only trained in the first phase and is only meant to generate accurate data following the same joint probability distribution of the real data, the results show that the model beats state-of-the-art GANs proposed in the literature to produce synthetic tabular data. Also, in the constrained case in which the first phase of training is followed by the second phase, we train the network and test it on four datasets studied in the fairness literature and compare our results with another state-of-the-art pre-processing method, and present the promising results that it achieves. Comparing to other studies utilizing GANs for fair data generation, our model is comparably more stable by using only one critic, and also by avoiding major problems of original GAN model, such as mode-dropping and non-convergence, by implementing a Wasserstein GAN.

## Method

{% include figure.html img="/images/papers/tabfairgan/architecture.png" caption="Model architecture. The generator uses ReLU for numerical attributes and Gumbel-softmax to form one-hot categorical attributes, then concatenates them. The critic is a fully connected network with LeakyReLU activations." %}

Training has two phases:

- **Phase I** (T<sub>1</sub> epochs): a standard WGAN-GP objective, so the generator learns the joint distribution of the real table.
- **Phase II** (T<sub>2</sub> epochs): a fairness term is added to the generator loss. It penalizes the *discrimination score* DS = P(y=1 &#124; s=1) − P(y=1 &#124; s=0) of the generated samples. A weight λ<sub>f</sub> controls the trade-off.

## Results

{% include figure.html img="/images/papers/tabfairgan/lambda_tradeoff.png" width="640px" caption="Adult dataset: increasing λ<sub>f</sub> steadily lowers the discrimination score of the generated data, while the drop in downstream accuracy stays small." %}

In unconstrained generation (Phase I only), TabFairGAN's synthetic Adult data trains more accurate downstream classifiers than TGAN and CTGAN in most settings. In fair generation, it removes almost all demographic disparity on Adult, Bank, COMPAS, and Law School, and does better than the CRDI pre-processing baseline on that measure.
