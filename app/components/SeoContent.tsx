import {useLocale} from '~/lib/locale';

export default function SeoContent() {
  const lang = useLocale();

  if (lang === 'en') {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-16 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black text-[#2d4a13] mb-6 text-center">
            Quality seeds for vegetable garden, balcony and garden at ProSeed.it
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-sm lg:text-base">
            <strong className="text-[#78c13b]">ProSeed.it</strong> is your reference e-commerce
            to buy <strong>seeds online</strong> of the highest quality, with a curated selection for
            every need: certified organic vegetable seeds, aromatic herb seeds for kitchen and balcony,
            ornamental and garden flower seeds, easy-to-grow succulent seeds, and fruit plant and
            hot pepper seeds.
          </p>
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Grow authenticity and freshness with our vegetable seeds</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tomato, zucchini, eggplant, lettuce, peppers, carrots, cucumbers, spinach, cabbage, turnips,
                onions, garlic, parsley, radishes, leeks, celery, green beans, peas, potatoes, pumpkins,
                cauliflower, chicory, radicchio, chard, watercress, rocket, fennel and Jerusalem artichoke.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Add flavor and aroma to your recipes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Discover our <strong>aromatic plant seeds</strong> to grow in pots or in the garden:
                basil, sage, mint, chives, lavender, oregano, chamomile, thyme, rosemary,
                marjoram, lemon balm, coriander and other hardy varieties.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Bring color and vitality to your space</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose <strong>balcony and garden flower seeds</strong>: helichrysum, mallow, violets,
                primroses, lupins, gerberas, gazanias, border lavender, wildflowers and perennial varieties.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Fruit plants and Hot Peppers</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We offer <strong>online fruit plant seeds</strong> such as strawberries, watermelons, sweet corn,
                together with a rich collection of <strong>hot pepper seeds</strong>, from the most common
                varieties like Jalapeno and Habanero to rare ones like Carolina Reaper.
              </p>
            </div>
          </div>
          <div className="bg-[#78c13b]/10 p-6 rounded-2xl mb-8">
            <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Easy-to-grow plants</h3>
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
              If you love low-maintenance plants, choose our <strong>succulent and cactus seeds</strong>
              for indoors and outdoors: Echinopsis, Rebutia, Opuntia, Echeveria, Euphorbia and Aloe.
            </p>
          </div>
          <p className="text-center text-gray-500 italic text-sm">
            At ProSeed.it you find selected seeds guaranteed for germination, with fast and secure shipping
            throughout Italy and Europe.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:py-16 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-[#2d4a13] mb-6 text-center">
          Semi online di qualit&agrave; per orto, giardino e balcone su ProSeed.it
        </h2>

        <p className="text-gray-600 leading-relaxed mb-8 text-sm lg:text-base">
          <strong className="text-[#78c13b]">ProSeed.it</strong> &egrave; il tuo e-commerce di riferimento
          per comprare <strong>semi online</strong> di alta qualit&agrave;, con una selezione curata per
          ogni esigenza: semi da orto biologici certificati, semi di piante aromatiche per cucina e balcone,
          semi di fiori ornamentali e da giardino, semi di piante grasse facili da coltivare e semi di piante
          da frutto e peperoncini piccanti.
        </p>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Coltiva genuinit&agrave; e freschezza con i nostri semi da orto online</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pomodoro, zucchine, melanzane, lattuga, peperoni, carote, cetrioli, spinaci, cavoli, rape,
              cipolle, aglio, prezzemolo, ravanelli, porri, sedano, fagiolini, piselli, patate, zucche,
              cavolfiori, cicoria, radicchio, bietole, crescione, rucola, finocchi e topinambur.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Aggiungi gusto e profumo alle tue ricette</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Scopri i nostri <strong>semi di piante aromatiche</strong> da coltivare in vaso o giardino:
              basilico, salvia, menta, erba cipollina, lavanda, origano, camomilla, timo, rosmarino,
              maggiorana, melissa, coriandolo e altre variet&agrave; resistenti.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Dona colore e vitalit&agrave; al tuo spazio</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Scegli i <strong>semi di fiori da balcone e da giardino</strong>: elicriso, malva, viole,
              primule, lupini, gerbere, gazanie, lavanda da bordura, fiori selvatici e variet&agrave; perenni.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Piante da frutto e Peperoncini</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Proponiamo <strong>semi di piante da frutto online</strong> come fragole, angurie, mais dolce,
              insieme a una ricca collezione di <strong>semi di peperoncini piccanti</strong>, dalle variet&agrave;
              pi&ugrave; comuni come Jalapeno e Habanero fino a quelle pi&ugrave; rare come Carolina Reaper.
            </p>
          </div>
        </div>

        <div className="bg-[#78c13b]/10 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-[#2d4a13] mb-3">Piante facili da coltivare</h3>
          <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
            Se ami le piante a bassa manutenzione, scegli i nostri <strong>semi di piante grasse e succulente</strong>
            da interni ed esterni: Echinopsis, Rebutia, Opuntia, Echeveria, Euphorbia e Aloe.
          </p>
        </div>

        <p className="text-center text-gray-500 italic text-sm">
          Su ProSeed.it trovi semi selezionati e garantiti per germinabilit&agrave;, con spedizione veloce
          e sicura in tutta Italia.
        </p>
      </div>
    </section>
  );
}
