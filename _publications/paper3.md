---
title: "Through a Fair Looking-Glass: Mitigating Bias in Image Datasets"
collection: publications
permalink: /publication/Fair_looking_glass
featured: true
excerpt: 'A fast way to de-bias an image dataset: a U-Net that reconstructs images while minimizing the statistical dependence between the target and protected attributes.'
date: 2023-01-01
venue: 'International Conference on Human-Computer Interaction (HCII 2023), Artificial Intelligence in HCI'
venue_short: 'HCII 2023'
authors: '**Amirarsalan Rajabi**, Mehdi Yazdani-Jahromi, Ozlem Ozmen Garibay, Gita Sukthankar'
tldr: 'A U-Net learns small edits to each image that reduce the statistical dependence (HSIC) between the target attribute (Attractive) and gender. This de-biases the dataset itself, so classifiers trained on it are fairer.'
teaser: /images/papers/lookingglass/faces_reconstructed.jpg
teaser_photo: true
animation: lookingglass
paperurl: 'https://doi.org/10.1007/978-3-031-35891-3_27'
links:
  paper: 'https://doi.org/10.1007/978-3-031-35891-3_27'
  arxiv: 'https://arxiv.org/abs/2209.08648'
citation: 'Rajabi, A., Yazdani-Jahromi, M., Garibay, O. O., & Sukthankar, G. (2023). Through a fair looking-glass: mitigating bias in image datasets. In International Conference on Human-Computer Interaction (pp. 446-459). Cham: Springer Nature Switzerland.'
bibtex: |
  @inproceedings{rajabi2023looking,
    title     = {Through a Fair Looking-Glass: Mitigating Bias in Image Datasets},
    author    = {Rajabi, Amirarsalan and Yazdani-Jahromi, Mehdi and Ozmen Garibay, Ozlem and Sukthankar, Gita},
    booktitle = {Artificial Intelligence in HCI (HCII 2023)},
    series    = {Lecture Notes in Computer Science},
    pages     = {446--459},
    publisher = {Springer},
    year      = {2023},
    doi       = {10.1007/978-3-031-35891-3_27}
  }
---

## Abstract

With the recent growth in computer vision applications, the question of how fair and unbiased they are has yet to be explored. There is abundant evidence that the bias present in training data is reflected in the models, or even amplified. Many previous methods for image dataset de-biasing, including models based on augmenting datasets, are computationally expensive to implement. In this study, we present a fast and effective model to de-bias an image dataset through reconstruction and minimizing the statistical dependence between intended variables. Our architecture includes a U-net to reconstruct images, combined with a pre-trained classifier which penalizes the statistical dependence between target attribute and the protected attribute. We evaluate our proposed model on CelebA dataset, compare the results with a state-of-the-art de-biasing method, and show that the model achieves a promising fairness-accuracy combination.

## Method

{% include figure.html img="/images/papers/lookingglass/architecture.png" width="680px" caption="(a) Training: a U-Net reconstructs a batch of images. An MSE loss keeps the output close to the input, and a frozen two-headed ResNet predicts gender and the target attribute so that their statistical dependence (HSIC) can be penalized. (b) Use: the trained U-Net transforms the dataset, and downstream classifiers are trained on the result." %}

## Results

Results on CelebA, using the attribute categories of Ramaswamy et al. (2021). Each value is the average over all attributes in that category.

<div class="paper__table" markdown="0">
<table>
  <thead>
    <tr><th rowspan="2"></th><th colspan="3">AP ↑</th><th colspan="3">DP ↓</th><th colspan="3">DEO ↓</th></tr>
    <tr><th>Incons.</th><th>G-dep</th><th>G-indep</th><th>Incons.</th><th>G-dep</th><th>G-indep</th><th>Incons.</th><th>G-dep</th><th>G-indep</th></tr>
  </thead>
  <tbody>
    <tr><td>Baseline</td><td>0.667</td><td>0.790</td><td>0.843</td><td>0.147</td><td>0.255</td><td>0.137</td><td>0.186</td><td>0.243</td><td>0.163</td></tr>
    <tr><td>GAN debiasing</td><td>0.641</td><td>0.763</td><td>0.831</td><td>0.106</td><td>0.233</td><td>0.119</td><td>0.158</td><td>0.240</td><td>0.142</td></tr>
    <tr><td>Adversarial debiasing</td><td>0.243</td><td>0.333</td><td>0.218</td><td>0.091</td><td>0.169</td><td>0.121</td><td>0.136</td><td>0.149</td><td>0.098</td></tr>
    <tr class="is-ours"><td>Ours</td><td>0.618</td><td>0.732</td><td>0.839</td><td>0.097</td><td>0.146</td><td>0.118</td><td>0.124</td><td>0.172</td><td>0.114</td></tr>
  </tbody>
</table>
</div>

{% include figure.html img="/images/papers/lookingglass/attribute_change.png" caption="How much the model changes each attribute (red: change in demographic parity of that attribute's classifier) compared with how strongly the attribute depends on <i>Attractive</i> in the original data (blue: HSIC). The model mostly edits attributes that are entangled with the target." %}

{% include figure.html img="/images/papers/lookingglass/lambda_tradeoff.png" caption="Increasing the fairness weight λ trades accuracy for fairness. Each point is the mean of three training runs. Shaded bands show one standard deviation." %}
