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

  // --- aisp.1.5: explaining it to somebody who owns the platform -------------
  'aisp.1.5': [
    {
      id: 'aisp.1.5-p1',
      prompt:
        'A penetration testing lead says the assistant is in scope for their next engagement and they ' +
        'will "test it like any other web app". In two or three sentences, say what that will and ' +
        'will not cover.',
      teach: {
        note:
          'A different audience with a different wrong assumption. The web application testing is ' +
          'genuinely necessary and it examines the service around the model, which leaves the model ' +
          'itself entirely untested unless somebody asks for that separately.',
      },
      solution:
        'It will cover the service around the model properly: authentication, authorisation, rate ' +
        'limiting, injection into the ordinary layers, and whether one tenant can reach another. It ' +
        'will not cover the model, because there is no request that makes it misbehave in the way a ' +
        'web vulnerability does; the failures there are prompt injection, extraction and the ' +
        'behaviour of the retrieval path, and they are tested by probing behaviour over many attempts ' +
        'and reporting a rate. I would ask for both and keep them as separate workstreams with ' +
        'separate reporting, because merging them hides whichever one produced fewer findings.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['auth', 'rate limit', 'tenant', 'service', 'api', 'ordinary', 'web'],
            ['model', 'prompt', 'injection', 'extraction', 'retrieval', 'behaviour', 'behavior'],
            ['rate', 'many attempts', 'probe', 'separate', 'both', 'different'],
          ],
          hint: 'Say what the web testing genuinely covers, what it leaves untouched, and what you would ask for.',
        },
      ],
    },
    {
      id: 'aisp.1.5-p2',
      prompt:
        'A data protection officer asks whether the model "contains" personal data. In two or three ' +
        'sentences, answer them.',
      teach: {
        note:
          'Harder than it looks because the honest answer is "not in the way you mean, and yes in a ' +
          'way that matters". Saying only the first half is technically defensible and leaves them ' +
          'with a false sense of the position.',
      },
      solution:
        'Not as records: there is no table inside the model and no query that retrieves a person, so ' +
        'it does not contain personal data the way a database does. It does carry the influence of ' +
        'whatever it was trained on, and where a record was distinctive or repeated it can sometimes ' +
        'be reproduced in output, which is a disclosure even though it is not storage. So the ' +
        'practical position is that erasure cannot be done by deleting a row, and the model has to ' +
        'be treated as a thing that may emit training data rather than as a thing that holds it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['not', 'no record', 'not a database', 'not stored', 'no table', 'not like'],
            ['reproduce', 'emit', 'memoris', 'memoriz', 'output', 'disclos', 'repeat'],
            ['erasure', 'delete', 'retrain', 'cannot', 'row', 'treat'],
          ],
          hint: 'Answer both halves: what it does not contain, and what it can still do.',
        },
      ],
    },
    {
      id: 'aisp.1.5-p3',
      prompt:
        'An engineering manager says they will add unit tests for the model so regressions get caught ' +
        'in CI. In two or three sentences, say what such a test can and cannot assert.',
      teach: {
        note:
          'The instinct is right and the shape has to change. A unit test asserts an exact output, ' +
          'and a model has no exact output to assert, so the useful version measures a rate over a ' +
          'set and fails on a threshold.',
      },
      solution:
        'A test can assert that the model still behaves acceptably on a fixed set of inputs: it ' +
        'refuses the things it should refuse, answers the things it should answer, and does not leak ' +
        'the system prompt. It cannot assert an exact output, because generation varies between runs ' +
        'and even a fixed seed does not survive a model upgrade. So the working form is a suite that ' +
        'measures a pass rate across many cases and fails the build when the rate drops below a ' +
        'threshold, which is a different thing from an assertion and has to be explained as such.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['set of inputs', 'cases', 'suite', 'behaviour', 'behavior', 'refuse', 'fixed set'],
            ['exact', 'cannot assert', 'varies', 'not identical', 'no single output', 'sampling'],
            ['rate', 'threshold', 'proportion', 'percentage', 'fails when', 'below'],
          ],
          hint: 'Say what is assertable, what is not, and what shape the test has to take instead.',
        },
      ],
    },
    {
      id: 'aisp.1.5-p4',
      prompt:
        'The platform lead accepts the point and asks what evidence they should require before the ' +
        'assistant goes live. In two or three sentences, give them a short list.',
      teach: {
        note:
          'The constructive half. Having explained what does not work, you are obliged to say what ' +
          'would, and a list somebody can put in a launch checklist is worth more than a correct ' +
          'objection they cannot act on.',
      },
      solution:
        'Three things. A record of what reaches the context, meaning which corpora are retrieved from ' +
        'and who can write to them, because that is where an attacker gets in without touching us. A ' +
        'measured result from adversarial testing, reported as a rate across named technique classes ' +
        'rather than as a pass. And a statement of what the model is permitted to do with its output: ' +
        'which tools it can call and what a human must approve, because that is what bounds the ' +
        'damage when the rate turns out to be non-zero.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['corpus', 'context', 'retriev', 'write access', 'what reaches', 'sources'],
            ['test', 'rate', 'adversarial', 'measured', 'technique', 'probe'],
            ['tool', 'permission', 'approve', 'allowed', 'output', 'bound', 'human'],
          ],
          hint: 'Name three concrete artefacts, each of which somebody could actually produce.',
        },
      ],
    },
    {
      id: 'aisp.1.5-p5',
      prompt:
        'Rewrite the core of your explanation in one sentence, for a change advisory board with two ' +
        'minutes on the agenda.',
      teach: {
        note:
          'Compression is the skill being drilled. A board does not need the mechanism; it needs to ' +
          'know that the usual evidence does not apply here and what is being offered instead, and ' +
          'that fits in a sentence if you are ruthless about it.',
      },
      solution:
        'The model\'s behaviour was learned from data rather than written as rules, so code review ' +
        'cannot tell us what it will do and the assurance we are offering instead is measured ' +
        'behaviour under adversarial testing, plus hard limits on what it is allowed to act on.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['learned', 'not written', 'from data', 'no rules', 'not specified'],
            ['review', 'inspect', 'read', 'code', 'cannot tell'],
            ['measur', 'test', 'behaviour', 'behavior', 'limit', 'allowed', 'bound'],
          ],
          hint: 'One sentence: why the usual evidence fails, and what replaces it.',
        },
      ],
    },
  ],

  // --- aisp.2.1: sorting failures by what they cost --------------------------
  'aisp.2.1': [
    {
      id: 'aisp.2.1-p1',
      prompt:
        'Classify each of these and say why in one clause each: (a) a fine-tuned model starts ' +
        'recommending a competitor because its training data was manipulated, (b) an attacker ' +
        'discovers the exact thresholds a fraud model uses by querying it, (c) a malformed prompt ' +
        'crashes the inference service.',
      teach: {
        note:
          'The same triad against three fresh cases. Sorting by what the attacker gained rather than ' +
          'by how the attack was performed is the habit: two attacks using identical technique can ' +
          'land in different columns depending on what changed.',
      },
      solution:
        'A is integrity: the decision itself was changed by manipulating what the model learned, and ' +
        'nothing was disclosed. B is confidentiality: the thresholds are operating detail the attacker ' +
        'now holds, and the model still behaves exactly as before. C is availability: nothing was ' +
        'disclosed and no decision was altered, the service simply stopped answering.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['integrity', 'changed', 'altered', 'decision'],
            ['confidential', 'disclos', 'leak', 'reveal', 'learned'],
            ['availab', 'crash', 'stopped', 'denial', 'outage', 'down'],
          ],
          hint: 'One classification each, and say what the attacker gained rather than how they did it.',
        },
      ],
    },
    {
      id: 'aisp.2.1-p2',
      prompt:
        'An attacker extracts a usable copy of a model. In two or three sentences, say why that is a ' +
        'confidentiality failure even though nothing about the original changed.',
      teach: {
        note:
          'The case people hesitate over, because nothing was taken in the ordinary sense: the ' +
          'original is untouched and still serving. What was disclosed is the asset itself, which is ' +
          'the point at which "model as intellectual property" stops being a slogan.',
      },
      solution:
        'The model is the asset, and the attacker now has it: the training data, the compute and the ' +
        'tuning that produced it were the investment, and a copy that behaves like it captures most ' +
        'of that value. Nothing changed about the original and nothing stopped working, which rules ' +
        'out integrity and availability. What was lost is exclusive possession of something ' +
        'confidential, which is a disclosure even though the mechanism was answering questions ' +
        'normally.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['asset', 'value', 'investment', 'intellectual', 'property', 'the model itself'],
            ['copy', 'possess', 'now has', 'obtained', 'holds'],
            ['unchanged', 'nothing changed', 'still works', 'not altered', 'disclos'],
          ],
          hint: 'Say what the asset is, what the attacker now has, and why the other two categories do not fit.',
        },
      ],
    },
    {
      id: 'aisp.2.1-p3',
      prompt:
        'Give an example of a single AI incident that is a failure in two of the three categories at ' +
        'once, and say which two.',
      teach: {
        note:
          'The triad is a sorting aid, not a partition, and pretending every incident lands in one ' +
          'box produces reports that undersell what happened. Being able to name a genuine overlap ' +
          'is what stops the framework becoming a filing exercise.',
      },
      solution:
        'A prompt injection that makes a customer-facing assistant disclose another user\'s ' +
        'conversation and then act on the attacker\'s instruction is both. It is a confidentiality ' +
        'failure because a conversation that belonged to someone else was disclosed, and an integrity ' +
        'failure because the assistant then took an action nobody authorised. Reporting only one of ' +
        'those would understate it, and the response differs for each half: one drives a notification ' +
        'decision and the other drives a rollback.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['confidential', 'disclos', 'leak', 'another user', 'exposed'],
            ['integrity', 'action', 'changed', 'altered', 'authorised', 'authorized', 'wrote'],
            ['both', 'two', 'each', 'differ', 'understate', 'response'],
          ],
          hint: 'Give one concrete incident, name both categories, and say why reporting one is not enough.',
        },
      ],
    },
    {
      id: 'aisp.2.1-p4',
      prompt:
        'In two or three sentences, say why availability failures on AI systems usually arrive as a ' +
        'bill rather than as an outage.',
      teach: {
        note:
          'The AI-specific twist on a familiar category. Inference is metered, so exhausting the ' +
          'resource looks like spend rather than downtime, and the control that stops it is a budget ' +
          'alarm rather than anything a security team usually owns.',
      },
      solution:
        'Inference is metered and usually elastic, so an attacker driving volume does not knock the ' +
        'service over, they run up the cost until somebody notices the invoice or a quota trips. That ' +
        'makes the failure slower and quieter than an outage and it lands on a budget holder rather ' +
        'than on a monitoring dashboard. The controls are correspondingly unusual for a security ' +
        'team: per-account rate limits, spend alerts and hard caps, which have to be set before the ' +
        'month they are needed.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['cost', 'spend', 'bill', 'invoice', 'budget', 'expensive'],
            ['elastic', 'scale', 'metered', 'not down', 'keeps serving', 'quota'],
            ['rate limit', 'cap', 'alert', 'quota', 'control', 'set'],
          ],
          hint: 'Say what happens instead of downtime, who notices, and what the control is.',
        },
      ],
    },
    {
      id: 'aisp.2.1-p5',
      prompt:
        'You have to explain to a board why "the model leaked its system prompt" is more serious on a ' +
        'detection system than on a customer chatbot. Two or three sentences.',
      teach: {
        note:
          'Applies the classification to a severity decision, which is where it earns its keep. The ' +
          'same technique in two places produces disclosures of very different value, and the ' +
          'difference is what the prompt contains rather than the fact of the leak.',
      },
      solution:
        'On a chatbot the system prompt is usually tone and scope instructions, so disclosing it is ' +
        'embarrassing and tells an attacker little they could not infer. On a detection system the ' +
        'prompt often carries the live rules and thresholds, so disclosing it hands an attacker the ' +
        'specification of what we detect and lets them tune their activity to sit underneath it. The ' +
        'technique is identical and the consequence is not, which is why severity has to be argued ' +
        'from what was disclosed rather than from the class of finding.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['tone', 'scope', 'little', 'embarrass', 'infer', 'harmless'],
            ['threshold', 'rule', 'detection', 'logic', 'specification', 'what we detect'],
            ['tune', 'evade', 'underneath', 'below', 'avoid', 'stay under'],
          ],
          hint: 'Contrast what each prompt contains, and say what the attacker does with the second one.',
        },
      ],
    },
  ],

  // --- aisp.2.2: where an attack enters, and where it must be addressed ------
  'aisp.2.2': [
    {
      id: 'aisp.2.2-p1',
      prompt:
        'A team proposes a runtime filter to catch poisoned training data. In two or three sentences, ' +
        'say why the control is in the wrong place.',
      teach: {
        note:
          'Entry point determines remedy, and this is the clearest case: by runtime the poisoning is ' +
          'already inside the weights, so a filter on the request path is inspecting the wrong thing ' +
          'at the wrong time.',
      },
      solution:
        'By the time a request arrives, poisoning has already been learned: it is in the parameters, ' +
        'and a filter on the input path cannot remove what the model knows. The runtime filter would ' +
        'only see the trigger if it could guess it, and the whole point of a backdoor trigger is ' +
        'that nobody outside the attacker knows what it looks like. Poisoning has to be addressed ' +
        'before or during training, through provenance and validation of the corpus, and remediated ' +
        'by retraining, which is why it is priced in weeks rather than in a deploy.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['already', 'learned', 'in the weights', 'in the model', 'parameters', 'too late'],
            ['trigger', 'guess', 'unknown', 'cannot know', 'hidden'],
            ['training', 'before', 'provenance', 'retrain', 'corpus', 'validat'],
          ],
          hint: 'Say when the damage was done, why runtime cannot see it, and where the control belongs.',
        },
      ],
    },
    {
      id: 'aisp.2.2-p2',
      prompt:
        'In two or three sentences, say why rate limiting is a reasonable control against extraction ' +
        'and a poor one against prompt injection.',
      teach: {
        note:
          'Matching a control to a failure mode by the shape of the attack. Extraction needs many ' +
          'requests and injection needs one, so a control priced in requests helps against exactly ' +
          'one of them.',
      },
      solution:
        'Extraction needs volume: the attacker has to query systematically to map the decision ' +
        'surface, so anything that reduces requests per account directly raises the time and cost. ' +
        'Injection needs one well-crafted request, so a limit that permits a thousand a day permits ' +
        'the attack a thousand times over and constrains nothing. The general rule is that ' +
        'rate-based controls work against attacks priced in requests and do nothing against attacks ' +
        'priced in cleverness.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['volume', 'many', 'systematic', 'thousands', 'repeated', 'quantity'],
            ['one', 'single', 'once', 'a single request', 'one prompt'],
            ['cost', 'raise', 'slow', 'does nothing', 'no effect', 'constrain'],
          ],
          hint: 'Contrast how many requests each attack needs, and draw the general rule.',
        },
      ],
    },
    {
      id: 'aisp.2.2-p3',
      prompt:
        'A vendor supplies a pre-trained model that scores well on every benchmark you run. In two or ' +
        'three sentences, say what the benchmarks do not tell you and what you would ask for instead.',
      teach: {
        note:
          'The supply chain case. A backdoor is dormant without its trigger, so it is invisible to ' +
          'exactly the evidence a procurement process collects, and the useful questions are about ' +
          'provenance rather than about performance.',
      },
      solution:
        'Benchmarks measure ordinary performance and a backdoor is dormant until its trigger appears, ' +
        'so a backdoored model scores normally on every one of them: the evidence and the risk do not ' +
        'overlap at all. What I would ask for is provenance: what the model was trained on, who ' +
        'assembled that data, what fine-tuning was applied afterwards and by whom, and whether the ' +
        'artefact is signed so we can tell we received what they built. None of that proves it is ' +
        'clean; it establishes who is accountable if it is not.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['dormant', 'trigger', 'normal', 'scores well', 'invisible', 'hidden', 'until'],
            ['provenance', 'trained on', 'who', 'fine-tun', 'fine tun', 'supply', 'sign'],
            ['not prove', 'does not prove', 'accountab', 'responsib', 'establish', 'no guarantee'],
          ],
          hint: 'Say why the benchmark misses it, what you would ask for, and what that does and does not settle.',
        },
      ],
    },
    {
      id: 'aisp.2.2-p4',
      prompt:
        'In two or three sentences, explain how fine-tuning a safe model can make it unsafe, and what ' +
        'that implies for a team that fine-tunes on customer data.',
      teach: {
        note:
          'The entry point people create for themselves. Safety behaviour is learned and further ' +
          'training can overwrite it, so a team improving accuracy can degrade refusal behaviour ' +
          'without ever intending to and without any measurement telling them.',
      },
      solution:
        'Safety behaviour is learned rather than enforced, so further training moves the same ' +
        'parameters and can erode it: fine-tuning on ordinary domain data has been shown to weaken ' +
        'refusals even when nothing in the data is adversarial. For a team fine-tuning on customer ' +
        'data that means two things: the customer data is now a poisoning channel, and the safety ' +
        'properties of the base model do not survive the tune automatically. Both are checkable only ' +
        'by re-running the safety evaluation against the fine-tuned artefact rather than citing the ' +
        'base model\'s results.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['learned', 'not enforced', 'same parameters', 'overwrite', 'erode', 'weaken'],
            ['customer data', 'poison', 'channel', 'attacker', 'who can write', 'their data'],
            ['re-run', 'rerun', 'evaluate again', 'retest', 're-test', 'not inherit', 'against the fine-tuned'],
          ],
          hint: 'Say why safety degrades, name the second risk the data itself introduces, and give the check.',
        },
      ],
    },
    {
      id: 'aisp.2.2-p5',
      prompt:
        'Pick any one of the five entrances and describe the cheapest control that meaningfully ' +
        'reduces it, being honest about what the control costs.',
      teach: {
        note:
          'Forces a commitment rather than a survey. Naming a cost alongside a control is what makes ' +
          'a recommendation credible to whoever has to approve it, and a control described as free ' +
          'is usually one nobody has costed.',
      },
      solution:
        'For the retrieval path, the cheapest meaningful control is restricting who can write to the ' +
        'indexed corpus. It costs almost nothing at runtime, needs no model changes and no latency, ' +
        'and it removes the entire class of attack where an outsider plants an instruction in a ' +
        'document. What it costs is organisational rather than technical: somebody has to own an ' +
        'approval step for corpus content, and teams who could previously publish straight to the ' +
        'wiki now wait, which is exactly the friction that gets controls quietly removed six months ' +
        'later.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['retriev', 'corpus', 'training', 'input', 'supply', 'fine-tun', 'entrance'],
            ['restrict', 'control', 'limit', 'approval', 'validate', 'rate limit', 'review'],
            ['cost', 'friction', 'latency', 'slows', 'someone has to', 'wait', 'overhead'],
          ],
          hint: 'Name the entrance, name the control, and be specific about the price somebody pays.',
        },
      ],
    },
  ],

  // --- aisp.2.3: who is positioned to do it ---------------------------------
  'aisp.2.3': [
    {
      id: 'aisp.2.3-p1',
      prompt:
        'A threat model lists "nation state actors" as the top risk to a customer service assistant. ' +
        'In two or three sentences, say what is wrong with that as a starting point.',
      teach: {
        note:
          'Capability without access is not a threat to this system. Starting from actor labels ' +
          'rather than from who can reach the surfaces produces a threat model that is impressive ' +
          'and useless, because every control it suggests is aimed at the wrong population.',
      },
      solution:
        'It starts from capability rather than access, and access is what decides who can actually do ' +
        'anything here. The people positioned against a customer assistant are the ones who can reach ' +
        'its surfaces: anybody who can type into it, anybody who can get content into whatever corpus ' +
        'it retrieves from, and the suppliers and insiders who sit next to the training data. A ' +
        'sophisticated actor with none of that access is less of a threat to this system than a ' +
        'contractor with write access to the wiki, and a threat model that inverts that will spend ' +
        'its budget in the wrong place.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['access', 'reach', 'position', 'who can', 'able to'],
            ['capability', 'sophistic', 'skill', 'resources', 'nation'],
            ['insider', 'supplier', 'contractor', 'user', 'anybody who can type', 'corpus', 'wiki'],
          ],
          hint: 'Name the distinction being missed, then say who is actually positioned.',
        },
      ],
    },
    {
      id: 'aisp.2.3-p2',
      prompt:
        'In two or three sentences, explain why a published jailbreak technique is not by itself an ' +
        'intrusion into your systems, and what it does change.',
      teach: {
        note:
          'A common category error that produces incident tickets for news articles. The publication ' +
          'changes the population who can perform the technique, which is a real change worth ' +
          'responding to, but responding to it as an incident wastes the response process.',
      },
      solution:
        'A published technique is a capability that now exists in the world, not an event that ' +
        'happened to us: nobody has touched our systems and there is nothing to contain or ' +
        'eradicate. What it changes is the population able to use it, which goes from people who ' +
        'could invent it to anybody who can read, so the likelihood of somebody trying it against us ' +
        'rises sharply. The right response is to test whether our deployment is susceptible and to ' +
        'add it to the regression suite, not to open an incident.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['not an incident', 'no intrusion', 'nothing happened', 'not an event', 'capability'],
            ['population', 'anybody', 'more people', 'likelihood', 'easier', 'widely'],
            ['test', 'check', 'regression', 'suite', 'assess', 'try it'],
          ],
          hint: 'Say what it is not, what it genuinely changes, and what to do about it.',
        },
      ],
    },
    {
      id: 'aisp.2.3-p3',
      prompt:
        'You are threat modelling an internal HR assistant available only to employees. In two or ' +
        'three sentences, say who you would treat as the adversary and why.',
      teach: {
        note:
          'Internal-only removes the external attacker and does not remove the threat. The awkward ' +
          'part is that the adversary is a colleague, which is a real conversation with HR and legal ' +
          'rather than a purely technical judgement.',
      },
      solution:
        'The adversary is an employee, because that is who has access, and the interesting cases are ' +
        'somebody curious about salaries or somebody trying to reach records that belong to another ' +
        'person. A compromised employee account is the same adversary with a different motive, and ' +
        'has to be assumed. That framing is uncomfortable to write down and it is the accurate one: ' +
        'the control that matters is not keeping outsiders out, it is making sure the assistant ' +
        'cannot answer beyond what the asking employee is already entitled to see.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['employee', 'insider', 'staff', 'colleague', 'internal user'],
            ['compromis', 'stolen', 'account', 'phish', 'taken over'],
            ['entitled', 'authoris', 'authoriz', 'permission', 'their own', 'access control', 'beyond'],
          ],
          hint: 'Name the adversary honestly, include the compromised-account case, and say what the control has to enforce.',
        },
      ],
    },
    {
      id: 'aisp.2.3-p4',
      prompt:
        'In two or three sentences, explain why somebody who can get content indexed into your ' +
        'retrieval corpus has a path that never touches your pipeline.',
      teach: {
        note:
          'The asymmetry that makes retrieval the most under-defended surface. The attacker writes to ' +
          'a system that was never considered security-relevant, and the payload is delivered by your ' +
          'own retriever on behalf of an innocent user.',
      },
      solution:
        'They never have to send you anything at request time: they write a document, your indexer ' +
        'picks it up on its next run, and your retriever later inserts it into the model\'s context ' +
        'on behalf of a user asking an ordinary question. Every control on the request path is ' +
        'irrelevant because nothing the user typed is unusual, and every control on the training ' +
        'pipeline is irrelevant because no training happened. The surface they attacked is whatever ' +
        'system holds the corpus, which is usually a wiki or a ticketing tool nobody classified as ' +
        'security-relevant.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['index', 'retriev', 'corpus', 'document', 'wiki', 'ticket'],
            ['nothing the user', 'ordinary', 'innocent', 'on behalf', 'normal question', 'request path'],
            ['not classified', 'not security', 'never considered', 'wiki', 'other system', 'unprotected'],
          ],
          hint: 'Trace the path from writing the document to it reaching the model, and say which controls miss it.',
        },
      ],
    },
    {
      id: 'aisp.2.3-p5',
      prompt:
        'Rank these three by how cheaply each could poison a training corpus, and justify the order: ' +
        'an external attacker, a data supplier, an employee on the ML team.',
      teach: {
        note:
          'Forces the access-not-capability idea into an explicit ordering. The uncomfortable answer ' +
          'is usually that the cheapest path belongs to somebody you already trust, which is why ' +
          'supplier and insider controls matter more here than perimeter ones.',
      },
      solution:
        'The ML team employee is cheapest: they already have write access to the corpus and their ' +
        'changes look like ordinary work, so the attack costs them nothing beyond the decision. The ' +
        'data supplier is next, because they control a whole feed we ingest largely on trust, and ' +
        'anything they include arrives already inside the pipeline. The external attacker is by far ' +
        'the most expensive, since they have to find some indirect route such as a public source we ' +
        'scrape or a system they can write to that we later ingest. That ordering says the controls ' +
        'worth having are provenance, review of supplier feeds and separation of duties on the ' +
        'corpus, not perimeter defence.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['employee', 'insider', 'ml team', 'cheapest', 'already has'],
            ['supplier', 'feed', 'vendor', 'ingest', 'trust'],
            ['external', 'expensive', 'hardest', 'indirect', 'scrape', 'public'],
          ],
          hint: 'Give the order, justify each position by access, and say what the order implies for controls.',
        },
      ],
    },
  ],

  // --- aisp.2.4: adversarial examples, honestly ------------------------------
  'aisp.2.4': [
    {
      id: 'aisp.2.4-p1',
      prompt:
        'A team keeps their model weights private and concludes adversarial examples are not a ' +
        'concern. In two or three sentences, say why that does not follow.',
      teach: {
        note:
          'Transferability is the result that kills security-by-privacy for models. An attacker ' +
          'trains their own approximation, crafts against that, and a good share of what works there ' +
          'works against yours because both learned similar structure from similar data.',
      },
      solution:
        'Adversarial examples transfer: an attacker can train their own model on similar data, craft ' +
        'inputs that defeat it, and a meaningful share of those will also defeat yours, because both ' +
        'models learned similar structure from a similar distribution. So keeping the weights private ' +
        'raises the cost of a targeted attack and does not remove the class. It also does not help ' +
        'against an attacker who can simply query your model, since responses are enough to guide ' +
        'the search without ever seeing a parameter.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['transfer', 'similar', 'their own model', 'another model', 'carry over'],
            ['private', 'weights', 'secret', 'not enough', 'does not remove', 'raises cost'],
            ['quer', 'responses', 'api', 'without seeing', 'black box', 'feedback'],
          ],
          hint: 'Name the phenomenon, say what privacy does buy, and give the second route that ignores it.',
        },
      ],
    },
    {
      id: 'aisp.2.4-p2',
      prompt:
        'In two or three sentences, say why calling an adversarial example "a bug in the inference ' +
        'code" leads a team to the wrong remedy.',
      teach: {
        note:
          'Diagnosis determines remedy. If it is read as a coding defect the team goes looking for a ' +
          'patch, finds nothing, and concludes the report was wrong; the actual remedies are all in ' +
          'training and architecture.',
      },
      solution:
        'It is not a defect in the code: the inference path executed correctly and returned the ' +
        'model\'s genuine answer for that input, and there is no line to fix. Reading it as a bug ' +
        'sends the team hunting for a patch that does not exist, and when they fail to find one they ' +
        'tend to conclude the finding was overstated. The real remedies are elsewhere: adversarial ' +
        'training, input transformation, ensembling, or accepting the rate and bounding what a ' +
        'misclassification can cause, none of which look like a code change.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['not a defect', 'no bug', 'correct', 'executed', 'no line', 'working as'],
            ['patch', 'fix', 'looking for', 'no such', 'dismiss', 'overstated'],
            ['adversarial training', 'transform', 'ensemble', 'bound', 'accept', 'architecture', 'elsewhere'],
          ],
          hint: 'Say what the code actually did, what the wrong diagnosis causes, and where the remedies really are.',
        },
      ],
    },
    {
      id: 'aisp.2.4-p3',
      prompt:
        'Adversarial training is proposed for a malware classifier. In two or three sentences, say ' +
        'what it buys and what it costs.',
      teach: {
        note:
          'The honest cost statement is what makes the recommendation usable. Adversarial training ' +
          'genuinely works and it takes ordinary accuracy and a lot of compute with it, and a ' +
          'proposal that omits that will be reversed the first time detection rates dip.',
      },
      solution:
        'It buys a real reduction in susceptibility: training against perturbed inputs moves the ' +
        'learned boundary so that the perturbations you trained against stop working. It costs ' +
        'ordinary accuracy, because the model is now fitting a harder objective and usually gets ' +
        'slightly worse on clean traffic, and it costs substantially more compute per training run. ' +
        'It also only covers the perturbation types you trained against, so it is a reduction rather ' +
        'than a fix, and stating that up front is what stops it being reversed when detection rates ' +
        'dip.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['reduce', 'less susceptible', 'harder', 'moves', 'improve', 'robust'],
            ['accuracy', 'clean', 'ordinary', 'worse', 'cost', 'compute', 'expensive'],
            ['only', 'trained against', 'not all', 'reduction', 'not a fix', 'other perturbations'],
          ],
          hint: 'State the benefit, both costs, and the limit on coverage.',
        },
      ],
    },
    {
      id: 'aisp.2.4-p4',
      prompt:
        'In two or three sentences, explain why a perturbation too small for a person to notice can ' +
        'change a model\'s answer, without saying the words "high dimensional".',
      teach: {
        note:
          'The constraint forces plain language. This is the explanation you need for anybody who ' +
          'has to sign off on the risk, and jargon here reliably converts a real concern into an ' +
          'abstraction they discount.',
      },
      solution:
        'The model is not looking at the input the way a person does: it is measuring many small ' +
        'numerical features and combining them, and its notion of "similar" is not ours. A change ' +
        'spread across many of those features can be individually tiny, invisible to a human, and ' +
        'still add up to a large movement in the terms the model actually uses. So two inputs that ' +
        'look identical to us can sit comfortably on opposite sides of the line it learned.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['many', 'features', 'numbers', 'measures', 'combin', 'spread across'],
            ['tiny', 'small', 'invisible', 'imperceptible', 'unnoticeable', 'each'],
            ['add up', 'accumulate', 'large', 'different', 'not the same', 'opposite', 'line'],
          ],
          hint: 'Describe what the model measures, why small changes accumulate, and what that does to the answer.',
        },
      ],
    },
    {
      id: 'aisp.2.4-p5',
      prompt:
        'Your model is evaded by an adversarial sample in production. In two or three sentences, say ' +
        'what you would do first, given that you cannot patch the model today.',
      teach: {
        note:
          'The incident version. The remedies all take a retraining cycle, so the first move has to ' +
          'be compensating rather than corrective, and knowing that in advance is what stops the ' +
          'first hour going on an argument about whose fault it is.',
      },
      solution:
        'Nothing I can do to the model helps today, so the first move is compensating control: raise ' +
        'the weight of other signals for that decision, add a human review step for the affected ' +
        'class, or block on a cruder rule that the perturbation does not touch. In parallel I would ' +
        'preserve the sample, because it is the seed of both the detection and the adversarial ' +
        'training set. The model change comes in the next training cycle and I would say so ' +
        'explicitly, so nobody waits for a fix that is weeks away while the compensating control is ' +
        'quietly removed.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['compensat', 'other signal', 'human', 'review', 'second control', 'rule', 'block'],
            ['preserve', 'keep', 'sample', 'collect', 'seed', 'add to'],
            ['next', 'retrain', 'cycle', 'weeks', 'later', 'not today', 'say so'],
          ],
          hint: 'Give the immediate action, what you keep, and what you tell people about the timeline.',
        },
      ],
    },
  ],

  // --- aisp.3.1: what gets memorised ----------------------------------------
  'aisp.3.1': [
    {
      id: 'aisp.3.1-p1',
      prompt:
        'A team is about to train on a corpus scraped from the open web. In two or three sentences, ' +
        'say which single preprocessing step most reduces memorisation risk and why it works.',
      teach: {
        note:
          'Deduplication is the cheapest privacy control available and it is usually skipped because ' +
          'it looks like a data-quality chore rather than a security one. Repetition is the strongest ' +
          'predictor of what can be pulled back out.',
      },
      solution:
        'Deduplication, including near-duplicates rather than only exact matches. Repetition is the ' +
        'strongest predictor of whether a specific string can be recovered from the model, and web ' +
        'scrapes are full of the same document mirrored across many sites, so a record that appears ' +
        'once in the world can appear hundreds of times in the corpus. Collapsing those to a single ' +
        'instance costs nothing at inference, needs no change to the architecture, and directly ' +
        'attacks the mechanism rather than trying to filter the output afterwards.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['dedup', 'duplicate', 'near-duplicate', 'repeated', 'mirror', 'collapse'],
            ['repetition', 'many times', 'appears', 'frequency', 'how often', 'predictor'],
            ['cheap', 'costs nothing', 'no change', 'before training', 'mechanism', 'directly'],
          ],
          hint: 'Name the step, say why repetition matters, and say what makes it a cheap control.',
        },
      ],
    },
    {
      id: 'aisp.3.1-p2',
      prompt:
        'In two or three sentences, explain why a rare account number is more recoverable from a ' +
        'model than a common phrase that appears in most documents.',
      teach: {
        note:
          'The counter-intuitive half: frequency across the corpus and distinctiveness of the string ' +
          'pull in different directions. A phrase everyone uses becomes a general pattern, and a ' +
          'string nobody else uses has to be stored as itself.',
      },
      solution:
        'A common phrase is learned as a general pattern because it appears in many contexts, so the ' +
        'model represents the regularity rather than any particular occurrence, and there is no ' +
        'specific instance to recover. A rare, long, structured string like an account number has no ' +
        'pattern behind it: the only way to reproduce it is to have retained that exact sequence. So ' +
        'distinctiveness is what makes something recoverable, and it is exactly the property that ' +
        'sensitive identifiers have by design.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['pattern', 'general', 'regularity', 'many contexts', 'common', 'generalis', 'generaliz'],
            ['rare', 'distinct', 'unusual', 'unique', 'structured', 'long', 'no pattern'],
            ['recover', 'reproduce', 'retain', 'exact', 'memoris', 'memoriz', 'specific'],
          ],
          hint: 'Contrast what the model does with each, and say which property makes something recoverable.',
        },
      ],
    },
    {
      id: 'aisp.3.1-p3',
      prompt:
        'A team trains for many more epochs on a small dataset because accuracy keeps improving. In ' +
        'two or three sentences, say what they are also doing.',
      teach: {
        note:
          'The metric they are watching and the risk they are creating move together, which is why ' +
          'this happens to careful teams. Training-set accuracy improving late in a run is often the ' +
          'model committing examples to memory.',
      },
      solution:
        'Past a certain point the accuracy gains come from the model memorising individual examples ' +
        'rather than learning anything that generalises, which is why the improvement shows on the ' +
        'training set and not on held-out data. That is precisely the condition under which specific ' +
        'records can later be extracted, so they are trading a metric that looks good for a ' +
        'disclosure risk that is invisible on the dashboard. The check is the gap between training ' +
        'and validation performance, and a widening gap is the signal to stop.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['memoris', 'memoriz', 'individual', 'examples', 'overfit', 'commit'],
            ['generalis', 'generaliz', 'held out', 'held-out', 'validation', 'unseen', 'not improving'],
            ['extract', 'recover', 'disclos', 'risk', 'privacy', 'gap', 'stop'],
          ],
          hint: 'Say what the late accuracy gain actually is, where it does not show, and what risk it creates.',
        },
      ],
    },
    {
      id: 'aisp.3.1-p4',
      prompt:
        'In two or three sentences, describe how you would test whether a model has memorised ' +
        'something it should not have.',
      teach: {
        note:
          'Turning the property into a procedure. The technique is prefix completion: give the model ' +
          'the start of a record you know is in the corpus and see whether it produces the rest, ' +
          'which requires knowing your own corpus well enough to construct the prefix.',
      },
      solution:
        'Take records you know were in the training data, feed the model the first part of each, and ' +
        'see whether it completes them accurately: a model that reproduces the remainder of a rare ' +
        'string has retained that string rather than learned a pattern. Sample deliberately from the ' +
        'distinctive end of the corpus, since common text will complete plausibly whether it was ' +
        'memorised or not and tells you nothing. Report it as a rate over many attempts, and note ' +
        'that a negative result only covers the prefixes you tried.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['prefix', 'first part', 'beginning', 'start of', 'complete', 'continuation'],
            ['known', 'training data', 'in the corpus', 'records we', 'distinctive', 'rare'],
            ['rate', 'many', 'sample', 'only covers', 'not exhaustive', 'attempts'],
          ],
          hint: 'Describe the procedure, say which records to choose, and be honest about what a negative proves.',
        },
      ],
    },
    {
      id: 'aisp.3.1-p5',
      prompt:
        'In two or three sentences, say why "we removed names before training" is a weaker control ' +
        'than it sounds.',
      teach: {
        note:
          'Identifier removal addresses one field and leaves the combination. It is worth doing and ' +
          'it is routinely described as though it settled the question, which is the claim to push ' +
          'back on.',
      },
      solution:
        'Removing names removes one identifier and leaves everything else, and people are ' +
        're-identifiable from combinations that individually look harmless: a postcode, a date, a job ' +
        'title and an employer will often pick out one person. It also does nothing about the free ' +
        'text, where an email address, a reference number or a distinctive turn of phrase can carry ' +
        'the identity the name field no longer does. So it is a useful step and not a sufficient one, ' +
        'and describing the result as anonymised is a claim that needs testing rather than asserting.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['combination', 'together', 'quasi', 'postcode', 'date', 'other fields', 're-identif', 'reidentif'],
            ['free text', 'unstructured', 'email', 'reference', 'remains', 'still in'],
            ['not sufficient', 'weaker', 'useful', 'not enough', 'claim', 'test'],
          ],
          hint: 'Say what is left behind in the structured data, what is left in the free text, and how to describe the result honestly.',
        },
      ],
    },
  ],

  // --- aisp.3.2: deletion, erasure and what a model keeps -------------------
  'aisp.3.2': [
    {
      id: 'aisp.3.2-p1',
      prompt:
        'A customer asks for erasure. In two or three sentences, say what you can honestly promise ' +
        'them about the model, as opposed to the database.',
      teach: {
        note:
          'A drill in saying something uncomfortable accurately. Over-promising here is a compliance ' +
          'exposure in itself, and the honest answer has a shape: what is removed now, what is ' +
          'removed on a schedule, and what is a residual.',
      },
      solution:
        'I can promise the records are removed from the warehouse and from any future training set, ' +
        'and that they will not be used to build anything from here on. I cannot promise the current ' +
        'model has forgotten them, because what it learned is distributed across parameters and no ' +
        'deletion touches that; only retraining without the record, or an approved unlearning ' +
        'procedure, changes it. So the honest answer names a date at which a retrained model replaces ' +
        'the current one, and describes the interim as a residual we are accepting rather than as ' +
        'compliance already achieved.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['warehouse', 'database', 'removed', 'future training', 'deleted', 'records'],
            ['cannot', 'not forget', 'still', 'learned', 'distributed', 'parameters'],
            ['retrain', 'unlearn', 'date', 'schedule', 'residual', 'interim'],
          ],
          hint: 'Separate what is genuinely done from what is not, and say what would change it and when.',
        },
      ],
    },
    {
      id: 'aisp.3.2-p2',
      prompt:
        'A colleague argues that because the training data was publicly available, consent and lawful ' +
        'basis are settled. In two or three sentences, respond.',
      teach: {
        note:
          'The most common misunderstanding in AI data protection, and it is not a technical point at ' +
          'all. Public availability speaks to accessibility, not to permission, and the purpose the ' +
          'data is now being used for is a new one.',
      },
      solution:
        'Public availability says the data could be accessed, not that it may be processed for a new ' +
        'purpose: personal data posted on a forum is still personal data, and training a commercial ' +
        'model on it is a different purpose from the one it was shared for. Consent is not implied by ' +
        'visibility, and where consent is not the basis relied on, something else has to be, which ' +
        'means somebody has to have chosen and recorded it. It is also a question that gets much ' +
        'harder to answer after the training run than before it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['public', 'available', 'accessible', 'visible', 'posted'],
            ['purpose', 'different', 'new', 'not what', 'shared for', 'processing'],
            ['consent', 'lawful basis', 'not implied', 'recorded', 'chosen', 'still personal'],
          ],
          hint: 'Separate accessibility from permission, name the purpose problem, and say what still has to be established.',
        },
      ],
    },
    {
      id: 'aisp.3.2-p3',
      prompt:
        'In two or three sentences, say why the decisions about erasure and lawful basis belong before ' +
        'the training run rather than after it.',
      teach: {
        note:
          'The economics point that makes the governance argument land. Before the run these are ' +
          'filtering decisions costing nothing; after it, every one of them is priced in a full ' +
          'retraining cycle.',
      },
      solution:
        'Before the run they are filtering decisions: excluding a source or a set of records costs ' +
        'nothing beyond the choice, because nothing has been built yet. After the run every one of ' +
        'them is priced in a retraining cycle, which means compute, time and a revalidation of ' +
        'everything downstream, so the same decision that was free on Monday costs weeks in ' +
        'September. That asymmetry is the whole argument for a data review gate, and it is why ' +
        '"we will sort the data questions out later" is a decision to pay much more for the same ' +
        'answer.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['before', 'filter', 'exclude', 'choice', 'costs nothing', 'cheap'],
            ['after', 'retrain', 'compute', 'weeks', 'expensive', 'cycle', 'revalidat'],
            ['gate', 'review', 'asymmetr', 'later', 'more', 'why'],
          ],
          hint: 'Price the same decision at both times, and draw the conclusion about where the gate belongs.',
        },
      ],
    },
    {
      id: 'aisp.3.2-p4',
      prompt:
        'In two or three sentences, explain what machine unlearning offers and why it is not simply ' +
        'the answer to erasure.',
      teach: {
        note:
          'Worth knowing about honestly rather than dismissing or over-claiming. It is a real research ' +
          'area with real methods, and the approximate ones make a claim about a model that is hard ' +
          'to verify, which is exactly the property a regulator will press on.',
      },
      solution:
        'Unlearning aims to remove a record\'s influence from a trained model without a full ' +
        'retrain, and where it works it is much cheaper than the alternative. The difficulty is ' +
        'evidence: exact methods require the training to have been structured for it in advance, and ' +
        'approximate methods leave you asserting that influence was removed without a practical way ' +
        'to demonstrate it. So it is worth building for if you expect erasure requests at volume, and ' +
        'it does not yet let you tell a regulator that the data is gone in the way deleting a row ' +
        'does.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['remove', 'influence', 'without retrain', 'cheaper', 'faster'],
            ['exact', 'approximat', 'evidence', 'verif', 'demonstrat', 'prove', 'assert'],
            ['in advance', 'structured', 'not yet', 'regulator', 'unlike', 'row'],
          ],
          hint: 'Say what it promises, where the difficulty is, and how that compares to deleting a record.',
        },
      ],
    },
    {
      id: 'aisp.3.2-p5',
      prompt:
        'Write the two or three sentences you would add to a model card describing the erasure ' +
        'position, for somebody who will read it in a year.',
      teach: {
        note:
          'The durable artefact. A model card outlives the conversation, and the sentence that ' +
          'matters is the one saying which model version corresponds to which state of the data, ' +
          'because that is the question somebody will actually arrive with.',
      },
      solution:
        'This model was trained on data as it stood at the snapshot date recorded above; erasure ' +
        'requests received after that date are honoured in the source systems and in subsequent ' +
        'training sets, and are not reflected in this version\'s parameters. A record removed from ' +
        'the warehouse may therefore still have influenced this model, and the first version in which ' +
        'it has not is the next full retrain. Anyone assessing compliance should compare the request ' +
        'date against the snapshot date rather than assuming deletion propagated.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['snapshot', 'as at', 'date', 'trained on', 'version'],
            ['not reflected', 'still', 'influenced', 'may have', 'not removed'],
            ['retrain', 'next', 'subsequent', 'compare', 'assess', 'propagat'],
          ],
          hint: 'Tie the model version to a data date, state the residual plainly, and tell the reader what to compare.',
        },
      ],
    },
  ],

  // --- aisp.3.3: poisoning, and why sampling will not find it ---------------
  'aisp.3.3': [
    {
      id: 'aisp.3.3-p1',
      prompt:
        'In two or three sentences, explain why reviewing a random one per cent of a training corpus ' +
        'gives almost no assurance against a backdoor.',
      teach: {
        note:
          'A sampling-power argument, and worth being able to make numerically. A backdoor needs very ' +
          'few examples, so a small random sample will usually contain none of them, and finding ' +
          'nothing is the expected result whether or not the corpus is poisoned.',
      },
      solution:
        'A backdoor may need only a few dozen examples out of hundreds of thousands, so a one per ' +
        'cent random sample will usually contain none of them and finding nothing is the expected ' +
        'outcome either way. The review therefore cannot distinguish a clean corpus from a poisoned ' +
        'one, which means it produces confidence without evidence. What does help is targeted rather ' +
        'than random: examining the rows whose labels disagree with their content, the rows from ' +
        'sources that can write without review, and anything that appears with unusual consistency.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['few', 'dozen', 'small number', 'tiny', 'handful', 'rare'],
            ['random', 'sample', 'miss', 'none', 'expected', 'cannot distinguish'],
            ['targeted', 'label', 'disagree', 'source', 'consistency', 'instead', 'provenance'],
          ],
          hint: 'Make the sampling argument, say what finding nothing proves, and give what would work instead.',
        },
      ],
    },
    {
      id: 'aisp.3.3-p2',
      prompt:
        'In two or three sentences, explain why a targeted backdoor is cheaper for an attacker than ' +
        'shifting a model\'s general behaviour.',
      teach: {
        note:
          'The economics run opposite to intuition and it is the reason to worry about the specific ' +
          'attack rather than the dramatic one. A backdoor competes with nothing; broad behaviour ' +
          'change competes with the entire rest of the corpus.',
      },
      solution:
        'A backdoor only has to teach one association between a rare trigger and a chosen output, and ' +
        'because the trigger appears nowhere else in the corpus there is nothing competing with it, ' +
        'so a few dozen consistent examples are enough. Shifting general behaviour means outweighing ' +
        'everything else the model saw about that topic, which takes a substantial share of the ' +
        'corpus and is correspondingly hard to place. So the cheap attack is the precise one, which ' +
        'is also the one that hides from benchmarks because it is dormant until its trigger appears.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['trigger', 'rare', 'nothing else', 'no competition', 'one association', 'consistent'],
            ['outweigh', 'share', 'large', 'everything else', 'substantial', 'majority'],
            ['dormant', 'benchmark', 'hides', 'normal', 'until', 'invisible'],
          ],
          hint: 'Contrast what each attack has to overcome, and note the detection consequence.',
        },
      ],
    },
    {
      id: 'aisp.3.3-p3',
      prompt:
        'A model is found to be backdoored. In two or three sentences, say what remediation actually ' +
        'requires and why filtering the input will not do.',
      teach: {
        note:
          'The remedy is expensive and people reach for a cheaper one that does not work. A runtime ' +
          'filter would have to recognise a trigger nobody knows, which is the same impossibility as ' +
          'blocklisting an unknown password.',
      },
      solution:
        'Remediation means retraining from a corpus you have reason to trust, which is a full cycle ' +
        'plus the data review that should have happened first, so it is priced in weeks rather than ' +
        'in a deploy. Filtering the input cannot work because the trigger is whatever the attacker ' +
        'chose and nobody else knows it: you would be blocking a string you cannot name. The only ' +
        'interim control is compensating rather than corrective, such as requiring a second signal ' +
        'before acting on the model\'s output in the affected decision class.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['retrain', 'from scratch', 'clean', 'trusted', 'full cycle', 'weeks'],
            ['trigger', 'unknown', 'cannot name', 'do not know', 'attacker chose'],
            ['compensat', 'second signal', 'human', 'interim', 'bound', 'other control'],
          ],
          hint: 'State the real remedy and its price, say why filtering fails, and give the interim.',
        },
      ],
    },
    {
      id: 'aisp.3.3-p4',
      prompt:
        'In two or three sentences, say what a backdoored model would look like on your monitoring, ' +
        'assuming the trigger has not been used yet.',
      teach: {
        note:
          'The uncomfortable answer, and important because a team that expects to detect this will ' +
          'not invest in prevention. A dormant backdoor is behaviourally identical to a clean model, ' +
          'which is what pushes the control back to provenance.',
      },
      solution:
        'It would look exactly like a healthy model: accuracy normal, latency normal, error ' +
        'distribution normal, because a dormant backdoor changes nothing until its trigger appears. ' +
        'There is no drift to alert on and no anomaly to catch, so monitoring gives you nothing ' +
        'before the fact and only tells you afterwards, if the trigger produces an outcome somebody ' +
        'notices. That is precisely why the control has to be provenance at training time rather ' +
        'than detection at runtime.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['normal', 'healthy', 'nothing', 'identical', 'no difference', 'looks fine'],
            ['dormant', 'until', 'trigger', 'no drift', 'no anomaly'],
            ['provenance', 'training', 'prevent', 'before', 'not detection', 'upstream'],
          ],
          hint: 'Say what the monitoring shows, why, and what that implies about where the control belongs.',
        },
      ],
    },
    {
      id: 'aisp.3.3-p5',
      prompt:
        'You have one week and cannot review the whole corpus. In two or three sentences, say which ' +
        'rows you would look at and why those.',
      teach: {
        note:
          'Prioritisation under a real constraint, which is the form this question always takes. ' +
          'Provenance beats content: start from who could write, because that is a much smaller set ' +
          'than what was written.',
      },
      solution:
        'I would start from provenance rather than content: the rows from sources that can write ' +
        'without review, which on most corpora is a small fraction of the whole and covers every ' +
        'cheap poisoning path. Within those I would look at rows whose label disagrees with their ' +
        'text, and at any token or reference that appears with unusual consistency across a small ' +
        'set of rows, since a trigger has to be consistent to be learned. That is a few hours of ' +
        'work rather than a week, and it is aimed at where the attack has to be rather than spread ' +
        'evenly over where it probably is not.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['provenance', 'source', 'who can write', 'without review', 'feed', 'supplier'],
            ['label', 'disagree', 'content', 'mismatch', 'does not match'],
            ['consistent', 'repeated token', 'marker', 'unusual', 'appears across', 'trigger'],
          ],
          hint: 'Give the ordering, and justify each filter by where the attack has to live.',
        },
      ],
    },
  ],

  // --- aisp.4.1: direct and indirect injection ------------------------------
  'aisp.4.1': [
    {
      id: 'aisp.4.1-p1',
      prompt:
        'Classify each and say why in a clause: (a) a calendar invite whose description tells an ' +
        'assistant to forward the user\'s next meeting notes, (b) a user pasting an override into ' +
        'the chat box, (c) a PDF the assistant is asked to summarise containing hidden instructions.',
      teach: {
        note:
          'The same sort against three new carriers. Notice that two of these arrive through ordinary ' +
          'business features nobody thinks of as an input path, which is what makes indirect the ' +
          'harder half to defend.',
      },
      solution:
        'A is indirect: the attacker wrote a calendar invite and the assistant collected it, so ' +
        'nothing was typed at the system by the attacker. B is direct, because the attacker is ' +
        'present at the interface and every input control sees the text. C is indirect as well: the ' +
        'instruction arrived inside a document the user asked about, so the user delivered the ' +
        'payload without knowing it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['indirect', 'collected', 'ingested', 'fetched', 'not typed'],
            ['direct', 'typed', 'chat box', 'interface', 'present'],
            ['document', 'pdf', 'calendar', 'invite', 'user delivered', 'without knowing'],
          ],
          hint: 'Classify all three, and in each case say who put the text where the model found it.',
        },
      ],
    },
    {
      id: 'aisp.4.1-p2',
      prompt:
        'In two or three sentences, say why indirect injection is harder to defend than direct, given ' +
        'that the payload is the same either way.',
      teach: {
        note:
          'The asymmetry is about who is present and what your controls can see, not about the ' +
          'sophistication of the payload. Direct injection meets an authenticated request you can ' +
          'rate-limit and attribute; indirect meets none of that.',
      },
      solution:
        'With direct injection the attacker is at the interface: they are authenticated, their ' +
        'request is logged and attributable, and every input control is looking straight at the text. ' +
        'With indirect injection nobody suspicious sends anything: an ordinary user asks an ordinary ' +
        'question, and your own retrieval or ingestion delivers the payload on their behalf. So the ' +
        'controls you have are pointed at the wrong place, and the attack surface becomes whatever ' +
        'system holds the content, which is usually not one the security team was asked to review.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['authenticated', 'logged', 'attributable', 'present', 'sees the text', 'input control'],
            ['ordinary user', 'nothing suspicious', 'on their behalf', 'own retrieval', 'delivers', 'innocent'],
            ['wrong place', 'other system', 'not reviewed', 'surface', 'elsewhere'],
          ],
          hint: 'Contrast what your controls can see in each case, and say where the surface moves to.',
        },
      ],
    },
    {
      id: 'aisp.4.1-p3',
      prompt:
        'A screening assistant reads CVs. In two or three sentences, describe the indirect injection ' +
        'risk and the control you would put on it.',
      teach: {
        note:
          'A case where the attacker is the data subject, which is unusual and instructive: the ' +
          'person supplying the document has a direct incentive to manipulate the outcome, and the ' +
          'document is one you are obliged to accept.',
      },
      solution:
        'The candidate controls the document and has an obvious incentive, so a CV can carry hidden ' +
        'text, white-on-white or in metadata, instructing the assistant to rate the candidate ' +
        'highly, and the assistant reads it as part of the same sequence as its own instructions. ' +
        'The control I would put on it is not text filtering, because the phrasing is unbounded: it ' +
        'is that the assistant produces a summary for a human decision rather than a score that ' +
        'feeds an automatic filter. Extracting text to a plain, normalised form before it reaches ' +
        'the model closes off the hidden-formatting trick specifically, and is worth doing as well.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['hidden', 'white', 'metadata', 'invisible', 'concealed', 'formatting'],
            ['incentive', 'candidate', 'controls the document', 'supplies', 'benefits'],
            ['human', 'decision', 'not automatic', 'summary', 'normalis', 'normaliz', 'plain text', 'extract'],
          ],
          hint: 'Name the carrier, note who controls it, and give a control that does not depend on filtering text.',
        },
      ],
    },
    {
      id: 'aisp.4.1-p4',
      prompt:
        'In two or three sentences, say why a support ticket written by a customer is an injection ' +
        'carrier even though the customer is a legitimate user.',
      teach: {
        note:
          'Legitimacy of the author is irrelevant, which is the point people find hardest. The ' +
          'question is only whether the text is attacker-controlled and whether it reaches the ' +
          'context, and a legitimate customer can be an attacker or can be relaying one.',
      },
      solution:
        'Being a legitimate user says nothing about whether the text they supplied is safe: the ' +
        'ticket body is attacker-controlled content by definition, since the customer wrote it, and ' +
        'a triage assistant that reads it is putting that text into the same sequence as its own ' +
        'instructions. The customer may be acting deliberately or may themselves be relaying content ' +
        'from somewhere else. The useful question is never who the author is but whether the text ' +
        'is controlled by someone outside your trust boundary and whether it reaches the model.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['legitimate', 'does not matter', 'irrelevant', 'says nothing', 'still'],
            ['wrote it', 'attacker-controlled', 'attacker controlled', 'supplied', 'their text', 'controlled by'],
            ['reaches', 'same sequence', 'context', 'model reads', 'concatenat'],
          ],
          hint: 'Say why authorship is not the test, and give the test that actually applies.',
        },
      ],
    },
    {
      id: 'aisp.4.1-p5',
      prompt:
        'List the ingestion paths you would enumerate for an assistant before testing it, and say why ' +
        'the list matters more than the payloads.',
      teach: {
        note:
          'Coverage beats cleverness in this kind of testing. A brilliant payload against one of five ' +
          'paths leaves four untested, and the list is the artefact that makes the report mean ' +
          'something rather than a collection of anecdotes.',
      },
      solution:
        'Everything the system reads that it did not author: what the user types, any document or ' +
        'file it is given, anything it retrieves from a corpus, anything it fetches over the network, ' +
        'and any tool response it reads back. The list matters more than the payloads because a ' +
        'clever payload against one path says nothing about the other four, and an untested path is ' +
        'where the finding will be. It is also the thing that makes the report meaningful later: ' +
        '"held against nine techniques on all five ingestion paths" is a claim somebody can act on, ' +
        'and "we tried some prompts" is not.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['user', 'document', 'file', 'upload', 'retriev', 'corpus', 'fetch', 'tool'],
            ['coverage', 'untested', 'other paths', 'says nothing', 'one path'],
            ['report', 'claim', 'meaningful', 'scope', 'act on', 'later'],
          ],
          hint: 'Enumerate the paths, then say what completeness buys that a good payload does not.',
        },
      ],
    },
  ],
};
