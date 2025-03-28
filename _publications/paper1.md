---
title: "Fair Bilevel Neural Network (FairBiNN): On Balancing Fairness and Accuracy via Stackelberg Equilibrium"
collection: publications
permalink: /publication/FairBiNN
excerpt: 'This paper addresses the persistent challenge of bias in machine learning models, proposing a bilevel optimization approach that balances fairness and accuracy.'
date: 2024-12-01
venue: 'Advances in Neural Information Processing Systems (NeurIPS 2024)'
paperurl: # 'https://proceedings.neurips.cc/paper_files/paper/2024/hash/bef7a072148e646fcb62641cc351e599-Abstract-Conference.html'
citation: 'Yazdani-Jahromi, M., Khodabandeh Yalabadi, A., Rajabi, A., Tayebi, A., Garibay, I., & Garibay, O. (2024). Fair Bilevel Neural Network (FairBiNN): On Balancing fairness and accuracy via Stackelberg Equilibrium. Advances in Neural Information Processing Systems, 37, 105780-105818.'
---

The persistent challenge of bias in machine learning models necessitates robust solutions to ensure parity and equal treatment across diverse groups, particularly in classification tasks. Current methods for mitigating bias often result in information loss and an inadequate balance between accuracy and fairness. To address this, we propose a novel methodology grounded in bilevel optimization principles. Our deep learning-based approach concurrently optimizes for both accuracy and fairness objectives, achieving Pareto optimal solutions while mitigating bias in the trained model. Theoretical analysis shows that the upper bound on the loss incurred by this method is less than or equal to the loss of the Lagrangian approach. We demonstrate the efficacy of our model on tabular datasets such as UCI Adult and Heritage Health, outperforming state-of-the-art fairness methods.
