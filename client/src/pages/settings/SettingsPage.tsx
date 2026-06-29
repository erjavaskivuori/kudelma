import { CardVisibility } from '../../components/settings/CardVisibility';
import { DeleteProfile } from '../../components/settings/DeleteProfile';


const SettingsPage = () => {

  return (
    <section className="mx-auto max-w-5xl text-white">
      <div className="rounded-2xl border border-white/20 bg-white/10 md:p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] px-4 pt-4 md:p-0 text-white/70">
              Settings
            </p>
          </div>
        </div>
        <CardVisibility />
        <hr className="border-white/20" />
        <DeleteProfile />
      </div>
    </section>
  );
};

export default SettingsPage;
