const C   = f => a => b => f(b)(a);
const I   = a => a;
const Ix  = f => a => f(a);
const K   = a => _ => a;
const KI  = _ => a => a;
const B   = f => g => a => f(g(a));
const B2  = f => g => a => b => f(g(a)(b));
const B3  = f => g => a => b => c => f(g(a)(b)(c));
const M   = f => f(f);
const V   = a => b => f => f(a)(b);
const Y   = f => (x => f(x(x)))(x => f(x(x)));

const fst = p => p(K);
const snd = p => p(KI);

const succ = n => f => a => f(n(f)(a));
const add  = n => k => n(succ)(k);

const Phi  = p => V(snd(p))(B(succ)(snd)(p));
const zz   = V(KI)(KI);

const foldPair  = n => f => p => fst(n(f)(p));
const foldPair_ = n => f => p => snd(n(f)(p));

const fib = n => foldPair(n)(p => V(snd(p))(add(fst(p))(snd(p))))(Phi(zz));

const pred = n => foldPair(n)(Phi)(zz);
const sub  = n => k => k(pred)(n);

const mul  = n => k => (a => n(k(a)));
const pow  = k => n => n(k);

const True    = a => b => K(a)(b);
const False   = a => b => KI(a)(b);
const and     = p => q => p(q)(p);
const or      = p => q => p(p)(q);
const not     = p => p(False)(True);
const beq     = p => q => p(q)(not(q));
const xor     = p => q => not(beq(p)(q));

const jsnum = n => n(x => x + 1)(0);
const churchnum = n => !n || Math.round(n) <= 0 ? KI : B(succ)(churchnum)(Math.round(n) - 1);

const interact = f => n => B(jsnum)(f)(churchnum(n));
const interact2 = f => n => k => B2(jsnum)(f)(churchnum(n))(churchnum(k));


const curry = fn => {
  const arity = fn.length;

  return (function resolver() {
    const memory = Array.prototype.slice.call(arguments);
    return () => {
      const local = memory.slice();
      Array.prototype.push.apply(local, arguments);
      const next = local.length >= arity ? fn : resolver;
      return next.apply(null, local);
    };
  }());
};

const decurry = fn => (...args) => args.reduce((a, c) => typeof a === 'function' ? a(c) : a, fn);

// big props to this guy: https://stackoverflow.com/a/61958726/12888122
const importAll = () => {
  return {
    mod: null,
    fromJamda(v) {
      this.mod = require('./');
      const ks = Object.keys(this.mod)
        .filter(x => x !== 'importAll')
        .map(exportedElementId => global[exportedElementId] = this.mod[exportedElementId]);
      if (v) return ks;
    },
  };
};

const type = f => console.log(`${
  typeof f === 'function' ? f.name || 'anonymous f' : `constant ${typeof f}`
} :: ${
  f.def || f.toString()
}`);

const logpair = first => second => console.log(`( ${jsnum(first)}, ${jsnum(second)} )`);

type.def      = 'fn => void IO';
logpair.def   = 'a => b => void IO';

C.def         = 'f => a => b => f(b)(a)';
I.def         = 'a => a';
Ix.def        = 'f => a => f(a)';
K.def         = 'a => _ => a';
KI.def        = '_ => a => a';
B.def         = 'f => g => a => f(g(a))';
B2.def        = 'f => g => a => b => f(g(a)(b))';
B3.def        = 'f => g => a => b => c => f(g(a)(b)(c))';
M.def         = 'f => f(f)';
V.def         = 'a => b => f => f(a)(b)';
Y.def         = 'f => (x => f(x)(x))(x => f(x)(x))';

fst.def       = 'p => p(K)';
snd.def       = 'p => p(KI)';
succ.def      = 'n => f => a => f(n(f)(a))';
add.def       = 'n => k => n(succ)(k)';
Phi.def       = 'p => V(snd(p))(B(succ)(snd)(p))';
zz.def        = 'V(KI)(KI)';
pred.def      = 'n => fst(n(Phi)(zz))';
sub.def       = 'n => k => k(pred)(n)';
mul.def       = 'n => k => (a => n(k(a)))';
pow.def       = 'k => n => n(k)';
fib.def       = 'n => fst(n(p => V(snd(p))(add(fst(p))(snd(p))))(V(KI)(Ix)))';

True.def      = 'a => b => K(a)(b)';
False.def     = 'a => b => KI(a)(b)';
and.def       = 'p => q => p(q)(p)';
or.def        = 'p => q => p(p)(q)';
not.def       = 'p => p(False)(True)';
beq.def       = 'p => q => p(q)(not(q))';
xor.def       = 'p => q => not(beq(p)(q))';

jsnum.def     = 'churchnum => jsnum';
churchnum.def = 'jsnum => churchnum';
interact.def  = '(churchnum => churchnum) => jsnum => jsnum';
interact2.def = '(churchnum => churchnum => churchnum) => jsnum => jsnum => jsnum';
curry.def     = 'fn(n args) => 0(a) => ... n(z)';
decurry.def   = '(0(a) => ... n(z)) => fn(n args)';

const theExports = {
  jsnum,
  churchnum,

  interact, interact2,

  C, I, Ix, K, KI, B, B2, B3, M, V, Y,

  fst, snd, succ, pred, add, sub, mul, pow,

  fib,

  Phi, True, False,
  and, or, not, beq, xor,

  decurry, curry,
  importAll, type, logpair,
  foldPair, foldPair_,
};

Object.keys(theExports).forEach(f => {
  if (!theExports[f].inspect) {
    theExports[f].inspect = _ => `[J] >> ${theExports[f].name}`;
  }
});

module.exports = theExports;
