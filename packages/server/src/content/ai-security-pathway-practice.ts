/**
 * Practice drills for the AI Security Pathway's written exercises.
 *
 * WHY A MULTIPLE-CHOICE PARENT GETS FREE-TEXT DRILLS
 *
 * The parent offers four or five options and asks which are true. That is
 * recognition, and recognition is the right way to introduce an idea: a student
 * meeting adversarial transferability for the first time needs to see it stated
 * correctly beside three plausible wrong statements.
 *
 * It is a poor way to find out whether they understood it. With five options and
 * a "select all that apply" instruction, a student who half-followed the
 * teaching material lands on the right set often enough to move on. So every
 * drill here asks for the same idea in free text, against a different system,
 * and is graded on whether the answer contains the reasoning rather than on
 * whether it picked the right boxes.
 *
 * That inversion is the whole design: the parent is easier than the drills, and
 * a student who passed the parent by elimination will discover it here.
 *
 * HOW THEY ARE GRADED
 *
 * `answer-mentions`, a lowercase substring match requiring one synonym from
 * every group, with deliberately wide synonym lists so the check grades coverage
 * of the required ideas rather than particular vocabulary. Every model answer in
 * this file is run through the real evaluator by written-practice.test.ts, and
 * an empty answer must fail every one.
 */

import type { PracticeItem } from '@soc/shared';

export const AI_SECURITY_PATHWAY_PRACTICE: Record<string, PracticeItem[]> = {
  // --- aisp.1.1: what is frozen and what is not ------------------------------
  'aisp.1.1': [
    {
      id: 'aisp.1.1-p1',
      prompt:
        'A product manager says the assistant "learns from every conversation and gets better at our ' +
        'estate over time". In two or three sentences, say what is actually happening, and what would ' +
        'have to be true for their statement to be right.',
      teach: {
        note:
          'The most common misunderstanding about deployed models, and it matters operationally: a ' +
          'team who believes the model learns continuously will not ask when it was last retrained, ' +
          'which is the question that decides how stale its behaviour is.',
      },
      solution:
        'Nothing about the model changes as people use it: the parameters are frozen at inference, ' +
        'so serving a request cannot alter what it learned. What is probably happening is that ' +
        'conversations are logged, and a separate pipeline may later use those logs to fine-tune a ' +
        'new version. For their statement to be right there would have to be a retraining pipeline ' +
        'somebody runs deliberately, and the improvement arrives only when a new version is ' +
        'deployed rather than continuously.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['frozen', 'does not change', 'not change', 'fixed', 'static', 'unchanged'],
            ['log', 'collected', 'stored', 'pipeline', 'separate', 'later'],
            ['retrain', 'fine-tune', 'fine tune', 'new version', 'redeploy', 'new model'],
          ],
          hint:
            'Say what happens to the parameters during use, what the conversations are actually for, and what would have to happen for the model to improve.',
        },
      ],
    },
    {
      id: 'aisp.1.1-p2',
      prompt:
        'The same prompt sent twice to the same deployed model returns two different answers. A ' +
        'colleague files it as a bug. In two or three sentences, explain what happened and whether ' +
        'it is a bug.',
      teach: {
        note:
          'Variation between runs is a configuration choice rather than a defect, and it can be ' +
          'turned down. Whether it should be is a real question: a classifier that must be auditable ' +
          'wants determinism, and an assistant that must not repeat itself does not.',
      },
      solution:
        'Generation samples from a probability distribution over the next token rather than taking ' +
        'the most likely one every time, so two runs can differ with nothing about the model having ' +
        'changed. It is not a bug, it is a sampling setting: lowering the temperature makes output ' +
        'more repeatable and never guarantees identity. Whether it matters depends on the use, ' +
        'because a system whose decisions have to be auditable needs that determinism and a drafting ' +
        'assistant does not.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['sampl', 'random', 'probab', 'distribution', 'temperature'],
            ['not a bug', 'expected', 'by design', 'not a defect', 'normal'],
            ['temperature', 'setting', 'configur', 'reduce', 'deterministic', 'audit'],
          ],
          hint: 'Name the mechanism, answer the bug question directly, and say what could be changed.',
        },
      ],
    },
    {
      id: 'aisp.1.1-p3',
      prompt:
        'Explain in two or three sentences why "the model was fitted to data" rather than "somebody ' +
        'wrote rules" changes how you would assure it.',
      teach: {
        note:
          'The bridge from how the thing works to what your job is. If the behaviour is not written ' +
          'anywhere, reading is not an assurance technique and measurement has to replace it, which ' +
          'is a different budget and a different skill set.',
      },
      solution:
        'Because there is no source describing the behaviour, reading the system tells you the ' +
        'objective and the pipeline but not what was learned from them, and the parameters do not ' +
        'decompose into anything a reviewer can follow. So assurance has to move from inspection to ' +
        'measurement: testing behaviour on chosen inputs, including adversarial ones, and reporting ' +
        'a rate rather than a guarantee. That is a different activity from code review and it does ' +
        'not replace it, because the service around the model still has ordinary bugs.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['no source', 'not written', 'cannot read', 'no rules', 'not readable', 'nowhere'],
            ['test', 'measur', 'behaviour', 'behavior', 'probe', 'evaluat', 'empirical'],
            ['rate', 'not a guarantee', 'statistic', 'sample', 'never certain', 'does not prove'],
          ],
          hint: 'Say what cannot be inspected, what replaces inspection, and what kind of answer that produces.',
        },
      ],
    },
    {
      id: 'aisp.1.1-p4',
      prompt:
        'A vendor offers a model that "adapts to your environment in real time". In two or three ' +
        'sentences, say what you would ask them to establish what that means.',
      teach: {
        note:
          'Marketing language about adaptation could describe three different architectures with ' +
          'very different risk. Knowing which one you are buying is the difference between a retrieval ' +
          'system, a fine-tuning loop, and nothing at all.',
      },
      solution:
        'I would ask whether the model weights change and, if so, what triggers it and who approves ' +
        'the result, because continuous fine-tuning on customer traffic is a poisoning channel and a ' +
        'change-control problem at once. If the weights do not change, "adapts" probably means it ' +
        'retrieves our documents into the context at request time, which is a completely different ' +
        'risk centred on who can write to that corpus. If neither is true it means the prompt ' +
        'mentions our company name, and I would want them to say so plainly.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['weight', 'parameter', 'retrain', 'fine-tune', 'fine tune', 'change'],
            ['retriev', 'context', 'corpus', 'document', 'prompt', 'rag'],
            ['who', 'approv', 'trigger', 'control', 'poison', 'write'],
          ],
          hint: 'Ask the question that separates the architectures, and say why the answer changes the risk.',
        },
      ],
    },
    {
      id: 'aisp.1.1-p5',
      prompt:
        'In two or three sentences, say what a request log from a deployed model is worth to an ' +
        'attacker who obtains it, given that the model itself did not change during those requests.',
      teach: {
        note:
          'A consequence people miss because they are focused on the model. The logs are where the ' +
          'sensitive material actually accumulates, and they are an ordinary data-protection problem ' +
          'wearing an AI hat.',
      },
      solution:
        'The log is worth a great deal even though the model is unchanged, because it holds whatever ' +
        'users typed, which on a security assistant means alert detail, hostnames, account names and ' +
        'anything pasted in from an investigation. It also reveals which systems the organisation ' +
        'runs and what it is worried about, which is reconnaissance for free. So the log is an ' +
        'ordinary sensitive data store and should be classified, retained and access-controlled like ' +
        'one, rather than treated as telemetry.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['what users typed', 'prompt', 'input', 'content', 'pasted', 'question'],
            ['sensitive', 'personal', 'hostname', 'account', 'detail', 'confidential', 'reconnaissance'],
            ['classif', 'retention', 'access', 'control', 'protect', 'treat it', 'like any'],
          ],
          hint: 'Say what the log contains, why that is valuable, and how it should therefore be handled.',
        },
      ],
    },
  ],

  // --- aisp.1.2: why you cannot read the rules back --------------------------
  'aisp.1.2': [
    {
      id: 'aisp.1.2-p1',
      prompt:
        'An auditor asks you to "show the decision logic" of a loan model. In two or three sentences, ' +
        'say what you can give them and what you cannot.',
      teach: {
        note:
          'Refusing an auditor is not an option, so the skill is offering the evidence that does ' +
          'exist rather than saying no. This is also where explainability tooling belongs in the ' +
          'answer, honestly described as approximate.',
      },
      solution:
        'I can give them the training objective, the features, the data pipeline, the evaluation ' +
        'results and the behaviour of the model on any input they want to try, including inputs ' +
        'chosen to probe a particular concern. I cannot give them a list of decision rules, because ' +
        'the model has none: the behaviour is distributed across parameters that do not decompose ' +
        'into readable conditions. Feature attribution tools can indicate which inputs mattered for ' +
        'a given decision, and those are approximations of the model rather than the model itself, ' +
        'which is a distinction the report has to make.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['objective', 'pipeline', 'data', 'feature', 'evaluation', 'training'],
            ['cannot', 'no rules', 'not decompose', 'not readable', 'no list', 'does not exist'],
            ['behaviour', 'behavior', 'test', 'attribution', 'explain', 'probe', 'approximat'],
          ],
          hint: 'Offer what exists, state plainly what does not, and be honest about what explainability tools are.',
        },
      ],
    },
    {
      id: 'aisp.1.2-p2',
      prompt:
        'A model scores 96% on its test set. In two or three sentences, say what that number does and ' +
        'does not license you to expect in production.',
      teach: {
        note:
          'The single most over-read number in machine learning. It describes performance on a ' +
          'distribution, and production is a different distribution that also contains an adversary ' +
          'choosing inputs, which the test set did not.',
      },
      solution:
        'It licenses you to expect roughly that accuracy on data drawn from the same distribution as ' +
        'the test set, and nothing more. Production traffic drifts away from that distribution over ' +
        'time, and more importantly it contains an adversary who is choosing inputs deliberately, ' +
        'which no held-out sample does. So the honest reading is 96% on last year\'s data under no ' +
        'pressure, and the number that matters operationally is how it performs on inputs somebody ' +
        'picked to defeat it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['same distribution', 'test set', 'held out', 'held-out', 'similar data', 'that data'],
            ['drift', 'production', 'live', 'change', 'different', 'over time'],
            ['adversar', 'attacker', 'chosen', 'deliberate', 'worst case', 'picked'],
          ],
          hint: 'Say what the number covers, why production differs, and what the test set never contained.',
        },
      ],
    },
    {
      id: 'aisp.1.2-p3',
      prompt:
        'Two teams train the same architecture on the same data and get models that disagree on some ' +
        'inputs. In two or three sentences, explain how that is possible and what it implies for ' +
        'testing.',
      teach: {
        note:
          'Reproducibility in machine learning is weaker than people expect, and the implication is ' +
          'practical: a security finding established against one build has to be re-established ' +
          'against the next one rather than assumed to carry over.',
      },
      solution:
        'Training involves randomness in weight initialisation, in the order examples are seen, and ' +
        'in any dropout or augmentation, so two runs converge to different parameter sets that fit ' +
        'the data about equally well and differ near the decision boundary. The implication for ' +
        'testing is that results do not transfer between builds: a bypass you found against one ' +
        'model may not reproduce against a retrain, and one you failed to find may now exist. So ' +
        'testing has to be repeated per released model rather than done once for the architecture.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['random', 'initialis', 'initializ', 'order', 'seed', 'stochastic', 'dropout'],
            ['boundary', 'differ', 'disagree', 'different parameters', 'not identical'],
            ['retest', 'per model', 'again', 'each build', 'not transfer', 'repeat', 'every release'],
          ],
          hint: 'Name the sources of randomness, say where the models differ, and give the testing consequence.',
        },
      ],
    },
    {
      id: 'aisp.1.2-p4',
      prompt:
        'Somebody proposes proving a model is safe by inspecting its weights for anything suspicious. ' +
        'In two or three sentences, say why that will not work.',
      teach: {
        note:
          'Worth being able to refute directly, because it sounds like the security-review instinct ' +
          'applied correctly. A backdoor is not a region of the parameters you could point at; it is ' +
          'a behaviour that only appears on its trigger.',
      },
      solution:
        'The weights are millions of numbers with no per-parameter meaning: no individual value ' +
        'corresponds to a rule, so there is nothing for "suspicious" to mean when you look at them. ' +
        'A backdoor in particular is not stored anywhere you could point at; it is a behaviour that ' +
        'appears only when its trigger is present, and the parameters look ordinary in every other ' +
        'case. The only way to find it is behavioural, by testing inputs, and that is limited by ' +
        'whether you can guess the trigger.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['no meaning', 'not readable', 'numbers', 'no individual', 'nothing to see', 'distributed'],
            ['backdoor', 'trigger', 'behaviour', 'behavior', 'only when', 'dormant'],
            ['test', 'behavioural', 'behavioral', 'input', 'guess', 'probe'],
          ],
          hint: 'Say what the weights are, why a backdoor is not visible in them, and what the alternative is.',
        },
      ],
    },
    {
      id: 'aisp.1.2-p5',
      prompt:
        'Write the two or three sentences you would put in an assurance report explaining why it ' +
        'reports rates rather than guarantees.',
      teach: {
        note:
          'The written deliverable. A reader who expects a pass or fail will read a rate as evasion ' +
          'unless the report explains why a rate is the honest form, and that paragraph is what stops ' +
          'the finding being rounded to "secure" by whoever summarises it.',
      },
      solution:
        'This system\'s behaviour was learned from data rather than specified as rules, so there is ' +
        'no source to inspect and no proof to construct; the available evidence is how it behaves on ' +
        'inputs we chose, including inputs designed to defeat it. Every result here is therefore a ' +
        'rate over a finite sample: it says how often a technique worked in this configuration during ' +
        'this window, and it cannot say that no technique exists. Read a low rate as a reduced ' +
        'likelihood rather than as an assurance that the failure cannot occur.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['learned', 'not specified', 'no source', 'no rules', 'from data'],
            ['rate', 'sample', 'finite', 'how often', 'proportion', 'frequency'],
            ['cannot say', 'not prove', 'no guarantee', 'does not mean', 'not assurance', 'exists'],
          ],
          hint: 'Explain why inspection is unavailable, what a rate is, and what a low rate does not mean.',
        },
      ],
    },
  ],

  // --- aisp.1.3: one sequence, no trusted channel ----------------------------
  'aisp.1.3': [
    {
      id: 'aisp.1.3-p1',
      prompt:
        'A developer proposes marking untrusted text by wrapping it in a special token the model was ' +
        'trained to respect. In two or three sentences, say what that achieves and where it stops.',
      teach: {
        note:
          'The best available version of the fence idea, and worth engaging with seriously rather ' +
          'than dismissing: a trained special token is stronger than XML tags. It is still a learned ' +
          'tendency rather than an enforced boundary, and the difference shows up as a failure rate.',
      },
      solution:
        'It genuinely helps, and more than plain tags do: a token the model was trained to treat as ' +
        'a boundary shifts the distribution towards ignoring instructions inside it, so casual ' +
        'injections stop working. It stops at being a tendency rather than a rule, because the ' +
        'boundary is something the model learned to respect rather than something the runtime ' +
        'enforces, so it has a failure rate that varies with phrasing and language. And if the ' +
        'attacker can emit the token themselves, the fence is theirs too.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['helps', 'stronger', 'reduce', 'works', 'better', 'shifts'],
            ['learned', 'trained', 'tendency', 'not enforced', 'habit', 'not a rule'],
            ['failure rate', 'sometimes', 'phrasing', 'emit', 'produce the token', 'varies', 'not guaranteed'],
          ],
          hint: 'Credit what it buys, name what kind of boundary it really is, and give a way it fails.',
        },
      ],
    },
    {
      id: 'aisp.1.3-p2',
      prompt:
        'In two or three sentences, explain why a filter that blocks the phrase "ignore previous ' +
        'instructions" is defeated by an attacker who never writes an instruction at all.',
      teach: {
        note:
          'Connects the one-sequence idea to the in-context learning one. If continuing a pattern and ' +
          'following an instruction are the same operation to the model, a payload made only of ' +
          'examples has nothing for a phrase filter to match.',
      },
      solution:
        'To the model there is no difference between following an instruction and continuing a ' +
        'pattern: both are next-token prediction over one sequence. So an attacker can supply a set ' +
        'of worked examples that establish a scheme, and the model applies it to the next item ' +
        'without any imperative ever appearing. The filter has nothing to match, because every line ' +
        'of the payload is a well-formed and innocuous example, and the instruction is carried by the ' +
        'structure rather than by any phrase.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['same', 'no difference', 'next token', 'next-token', 'continuing', 'pattern'],
            ['example', 'structure', 'format', 'few-shot', 'few shot', 'demonstrat'],
            ['no phrase', 'nothing to match', 'no keyword', 'no instruction', 'no imperative'],
          ],
          hint: 'Say what the model is actually doing, what the payload is made of, and why the filter is blind to it.',
        },
      ],
    },
    {
      id: 'aisp.1.3-p3',
      prompt:
        'In two or three sentences, explain what tokenisation is and why it is where encoding bypasses ' +
        'live.',
      teach: {
        note:
          'The mechanical detail that makes a whole class of bypass predictable rather than magical. ' +
          'A filter reads characters, the model reads tokens, and anything that changes the mapping ' +
          'between the two opens a gap.',
      },
      solution:
        'Text is split into subword tokens before the model sees it, and the split is a property of ' +
        'the tokeniser rather than of the words: the same meaning can be expressed as different ' +
        'token sequences. Encoding bypasses live in the gap between what a filter matches and what ' +
        'the model reads, because the filter examines characters while the model consumes tokens. ' +
        'Substituting homoglyphs, inserting zero-width characters or encoding the payload changes ' +
        'the character string a filter sees without changing what the model ultimately understands.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['subword', 'token', 'split', 'pieces', 'chunk'],
            ['filter', 'match', 'sees', 'reads', 'character', 'string'],
            ['homoglyph', 'encoding', 'zero-width', 'substitut', 'base64', 'obfuscat', 'unicode'],
          ],
          hint: 'Define the mechanism, name the two different views of the text, and give a concrete bypass.',
        },
      ],
    },
    {
      id: 'aisp.1.3-p4',
      prompt:
        'A team puts the system prompt first and concludes that it therefore takes precedence. In two ' +
        'or three sentences, say what is wrong with that reasoning.',
      teach: {
        note:
          'Ordering does help, which is what makes the reasoning seductive. The error is treating a ' +
          'statistical tendency as a precedence rule, and the practical consequence is that a long ' +
          'enough or emphatic enough later instruction can outweigh it.',
      },
      solution:
        'Position is a convention the model has learned to weight, not a precedence rule the runtime ' +
        'applies: everything arrives as one sequence and nothing in it is marked authoritative. ' +
        'Putting the system prompt first does make it more likely to be followed, which is why the ' +
        'convention exists, but "more likely" is not "guaranteed". A later instruction that is longer, ' +
        'more specific or more emphatic can outweigh it, and the failure is silent because the model ' +
        'produces a confident answer either way.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['convention', 'tendency', 'learned', 'not a rule', 'not enforced', 'more likely'],
            ['one sequence', 'no marker', 'not authoritative', 'no field', 'same text'],
            ['later', 'outweigh', 'override', 'longer', 'emphatic', 'specific', 'can still'],
          ],
          hint: 'Say what ordering actually buys, why it is not precedence, and what can overcome it.',
        },
      ],
    },
    {
      id: 'aisp.1.3-p5',
      prompt:
        'Given that there is no trusted channel inside the context, in two or three sentences say ' +
        'where the trust boundary in an AI system actually is.',
      teach: {
        note:
          'The conclusion the module is built towards. If the boundary cannot be inside the prompt, ' +
          'it has to be around the system: what is allowed in, and what the output is allowed to do. ' +
          'That is an architecture question rather than a prompt-engineering one.',
      },
      solution:
        'The boundary cannot be inside the context, because everything there is one undifferentiated ' +
        'sequence, so it has to be around the system: what is permitted to reach the context, and ' +
        'what the model is permitted to do with its answer. In practice that means controlling who ' +
        'can write to any corpus the system retrieves from, and constraining which tools the model ' +
        'may call and what a human must approve. Both are ordinary access control, which is why the ' +
        'defensible version of this problem is an architecture question rather than a prompt one.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['not inside', 'cannot be in', 'around', 'outside', 'not in the prompt', 'system'],
            ['reach', 'enters', 'write', 'corpus', 'input', 'what goes in'],
            ['tool', 'action', 'permission', 'approve', 'output', 'allowed to do', 'privilege'],
          ],
          hint: 'Say where the boundary cannot be, then name the two places it can be.',
        },
      ],
    },
  ],

  // --- aisp.1.4: properties, not defects -------------------------------------
  'aisp.1.4': [
    {
      id: 'aisp.1.4-p1',
      prompt:
        'A vendor roadmap promises that the next release "eliminates hallucination". In two or three ' +
        'sentences, say what you would take that to mean and how you would test the claim.',
      teach: {
        note:
          'The claim is not simply false: a release can genuinely reduce fabrication a lot. The skill ' +
          'is converting an absolute claim into a measurable one, because that is the form in which ' +
          'it can be checked and the form in which a contract can be written.',
      },
      solution:
        'I would take it to mean the rate has been reduced, possibly substantially, because ' +
        'elimination is not available: generation predicts likely continuations and nothing in the ' +
        'mechanism checks a claim against anything. To test it I would ask questions with verifiable ' +
        'answers, including about things that do not exist, and measure how often it fabricates ' +
        'rather than whether it ever does. The number I want in the contract is a rate on our own ' +
        'questions, not an adjective in a roadmap.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['reduce', 'rate', 'less often', 'lower', 'improve', 'not eliminate'],
            ['no check', 'no verif', 'predict', 'likely', 'mechanism', 'nothing checks'],
            ['test', 'measure', 'questions', 'do not exist', 'verifiable', 'our own', 'contract'],
          ],
          hint: 'Reinterpret the claim as a rate, say why elimination is unavailable, and describe a test.',
        },
      ],
    },
    {
      id: 'aisp.1.4-p2',
      prompt:
        'Answer the mirror-image error: a risk lead concludes that because these failures cannot be ' +
        'eliminated, no consequential process should use a model. In two or three sentences, respond.',
      teach: {
        note:
          'The over-correction, and the one a security person is most at risk of making. Every ' +
          'consequential system already uses components that fail probabilistically; the question is ' +
          'always what the failure reaches, not whether it can occur.',
      },
      solution:
        'That standard would rule out most of what we already run: staff make mistakes, rules ' +
        'misfire, and no control we deploy has a zero failure rate, yet we use all of them in ' +
        'consequential processes. The question is never whether a component can fail but what its ' +
        'failure reaches, so the answer is to bound the consequence: keep a human on the decisions ' +
        'that matter, constrain what the model can act on, and monitor the rate. Used that way a ' +
        'model is an ordinary component with a known error rate, which is what everything else is.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['already', 'people', 'humans', 'other controls', 'everything', 'rules', 'nothing is perfect'],
            ['bound', 'consequence', 'blast', 'limit', 'constrain', 'reach', 'what it can do'],
            ['human', 'monitor', 'oversight', 'review', 'measure', 'rate'],
          ],
          hint: 'Point out what the standard would also exclude, then say what bounding the risk looks like.',
        },
      ],
    },
    {
      id: 'aisp.1.4-p3',
      prompt:
        'In two or three sentences, explain why adversarial susceptibility is reducible but not ' +
        'eliminable, without using the phrase "decision boundary".',
      teach: {
        note:
          'The constraint forces the idea into your own words. Explaining this without the jargon is ' +
          'the version you will need for anybody who does not already know what a boundary is, which ' +
          'is most of the people you have to convince.',
      },
      solution:
        'A model sorts inputs into classes, and the dividing line it learned is an approximation ' +
        'built from the examples it saw rather than the real distinction. Wherever that approximation ' +
        'differs from the truth there are inputs that sit on the wrong side of it, and an attacker ' +
        'searching deliberately can find them. Training against such inputs moves the line and ' +
        'usually costs ordinary accuracy, but it cannot make the approximation exact, so the ' +
        'susceptibility gets smaller rather than going away.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['approxim', 'learned from examples', 'not exact', 'imperfect', 'estimate'],
            ['search', 'find', 'attacker', 'deliberate', 'look for', 'wrong side'],
            ['reduce', 'smaller', 'cost', 'accuracy', 'not remove', 'never exact', 'trade'],
          ],
          hint: 'Describe what the model learned, why gaps exist, and what training against them buys and costs.',
        },
      ],
    },
    {
      id: 'aisp.1.4-p4',
      prompt:
        'A team reduces output variation to near zero by fixing the sampling settings. In two or ' +
        'three sentences, say what that gains them and what it does not fix.',
      teach: {
        note:
          'Determinism is genuinely valuable and it is easy to over-read as safety. A model that ' +
          'answers identically every time answers identically wrongly every time, and a reproducible ' +
          'jailbreak is more useful to an attacker than an unreliable one.',
      },
      solution:
        'It gains them reproducibility, which is worth a lot: the same input produces the same output, ' +
        'so results can be audited, regression-tested and compared between versions. It fixes nothing ' +
        'about correctness, because a deterministic model is deterministically wrong on the inputs it ' +
        'gets wrong, and fabrication and adversarial susceptibility are untouched. It also helps the ' +
        'attacker slightly, since a technique that works now works every time rather than ' +
        'intermittently.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['reproduc', 'same output', 'consistent', 'audit', 'regression', 'deterministic'],
            ['not', 'does not fix', 'still', 'unchanged', 'no effect on'],
            ['wrong', 'fabricat', 'adversarial', 'attacker', 'every time', 'reliable'],
          ],
          hint: 'Name the real gain, say what is untouched, and note who else benefits.',
        },
      ],
    },
    {
      id: 'aisp.1.4-p5',
      prompt:
        'Write the two or three sentences you would use in a design review to distinguish a property ' +
        'from a defect, so the team stops raising the same tickets.',
      teach: {
        note:
          'The organisational version of the idea. A team filing bugs against behaviour that cannot ' +
          'be fixed wastes effort and, worse, learns to treat the whole category as noise, which is ' +
          'when the genuine defects stop being reported.',
      },
      solution:
        'A defect is behaviour that departs from how the system is designed to work and can be ' +
        'corrected; a property is behaviour that follows from how the architecture works and can only ' +
        'be bounded. Fabrication, adversarial susceptibility and output variation are properties: ' +
        'raising them as bugs produces tickets nobody can close, and the effort belongs instead in ' +
        'measuring their rate and limiting what they can affect. What we should still file are ' +
        'departures from our own specification, such as a control that is not applied where the ' +
        'design says it is.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['defect', 'bug', 'departs', 'incorrect', 'can be fixed', 'corrected'],
            ['property', 'architecture', 'follows from', 'inherent', 'cannot be removed', 'bounded'],
            ['measure', 'rate', 'limit', 'bound', 'monitor', 'instead', 'specification'],
          ],
          hint: 'Define both terms, classify the AI failures, and say what the team should file instead.',
        },
      ],
    },
  ],
};
