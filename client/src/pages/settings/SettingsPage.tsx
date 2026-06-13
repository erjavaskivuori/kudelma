import { CardVisibility } from '../../components/settings/cardVisibility';


const SettingsPage = () => {

  return (
    <section className="mx-auto max-w-5xl text-white">
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/70">Settings</p>
          </div>
        </div>
        <CardVisibility />
        <hr className="border-white/20" />
      </div>
    </section>
  );
};

export default SettingsPage;
