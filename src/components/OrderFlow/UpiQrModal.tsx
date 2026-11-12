import React, {useMemo, useRef, useState} from 'react';
import QRCode from 'react-qr-code';
import {
  AlertCircle,
  Copy,
  Download,
  Loader2,
  Phone,
  QrCode,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {useTranslation} from 'react-i18next';
import {useGetPaymentDetails} from '@/lib/api and mutation/settings/useSettings';

interface UpiQrModalProps {
  amount: number;
  onClose: () => void;
}

/** Bottom sheet showing a UPI QR generated from the store's payment details. */
export const UpiQrModal: React.FC<UpiQrModalProps> = ({amount, onClose}) => {
  const {t} = useTranslation();
  const {
    data: details,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetPaymentDetails(true);

  const amountStr = (Number(amount) || 0).toFixed(2);

  // Standard UPI deep link — rebuilt whenever the API data or amount changes
  const upiUri = useMemo(() => {
    if (!details?.upiId) return '';
    const params = [
      `pa=${encodeURIComponent(details.upiId)}`,
      `pn=${encodeURIComponent(t('header.brand'))}`,
      Number(amountStr) > 0 ? `am=${amountStr}` : '',
      'cu=INR',
    ].filter(Boolean);
    return `upi://pay?${params.join('&')}`;
  }, [details?.upiId, amountStr, t]);

  const qrRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'download' | 'share' | null>(null);

  /** Render the on-screen QR (SVG) + amount + UPI ID into a PNG blob. */
  const buildQrPng = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg || !details?.upiId) return reject(new Error('QR not ready'));

      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('width', '480');
      clone.setAttribute('height', '480');
      clone.removeAttribute('style');
      const svgText = new XMLSerializer().serializeToString(clone);

      const img = new Image();
      img.onload = () => {
        const W = 600;
        const H = 760;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unavailable'));

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(img, 60, 50, 480, 480);

        const font = 'system-ui, -apple-system, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00450d';
        ctx.font = `800 44px ${font}`;
        ctx.fillText(`₹${amountStr}`, W / 2, 600);
        ctx.font = `600 24px ${font}`;
        ctx.fillText(`UPI ID: ${details.upiId}`, W / 2, 650);
        ctx.fillStyle = '#525e54';
        ctx.font = `500 20px ${font}`;
        ctx.fillText(t('header.brand'), W / 2, 700);

        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('PNG failed'))),
          'image/png',
        );
      };
      img.onerror = () => reject(new Error('QR image failed'));
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    });

  const fileName = `upi-qr-${(details?.upiId || 'pay').replace(/[^\w.-]/g, '_')}-${amountStr}.png`;

  const handleDownload = async () => {
    setBusy('download');
    try {
      const blob = await buildQrPng();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(t('upi.downloaded'));
    } catch {
      toast.error(t('upi.shareFailed'));
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (!details?.upiId) return;
    setBusy('share');
    const text = t('upi.shareText', {
      amount: amountStr,
      upiId: details.upiId,
      link: upiUri,
    });
    const title = t('upi.title');
    try {
      const blob = await buildQrPng().catch(() => null);
      const file = blob
        ? new File([blob], fileName, {type: 'image/png'})
        : null;

      if (file && navigator.canShare?.({files: [file]})) {
        await navigator.share({files: [file], title, text});
      } else if (navigator.share) {
        await navigator.share({title, text});
      } else {
        await navigator.clipboard.writeText(text);
        toast.success(t('upi.linkCopied'));
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') toast.error(t('upi.shareFailed'));
    } finally {
      setBusy(null);
    }
  };

  const copyUpiId = async () => {
    if (!details?.upiId) return;
    try {
      await navigator.clipboard.writeText(details.upiId);
      toast.success(t('upi.copied'));
    } catch {
      toast.error(t('upi.copyFailed'));
    }
  };

  return (
    <div
      className="backdrop-blur-2xs fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0"
      onClick={onClose}
    >
      <div
        className="animate-in slide-in-from-bottom w-full max-w-md space-y-4 rounded-t-3xl bg-white p-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-300 mx-auto h-1.5 w-12 rounded-full" />
        <div className="flex items-center gap-2">
          <QrCode size={18} className="text-[#1b5e20]" />
          <h3 className="text-base font-extrabold text-[#1b1c1c]">
            {t('upi.title')}
          </h3>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-[#1b5e20]">
            <Loader2 size={26} className="mx-auto animate-spin" />
            <p className="mt-2 text-xs font-semibold">{t('upi.loading')}</p>
          </div>
        ) : isError ? (
          <div className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <AlertCircle size={26} className="mx-auto text-red-500" />
            <p className="text-sm font-bold text-red-900">{t('upi.error')}</p>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => refetch()}
              className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isFetching ? t('common.loading') : t('orders.tryAgain')}
            </button>
          </div>
        ) : !details ? (
          <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
            <AlertCircle size={26} className="mx-auto text-amber-600" />
            <p className="text-sm font-bold text-amber-900">
              {t('upi.unavailable')}
            </p>
            <p className="text-xs text-amber-800">{t('upi.useCod')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div
                ref={qrRef}
                className="shadow-2xs rounded-2xl border border-[#e0e6e0] bg-white p-3"
              >
                <QRCode
                  value={upiUri}
                  size={200}
                  style={{height: 'auto', maxWidth: '100%', width: 200}}
                />
              </div>
              <p className="text-xl font-black text-[#00450d]">₹{amountStr}</p>
              <div className="grid w-full grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={handleDownload}
                  className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#00450d] py-2 text-xs font-bold text-[#00450d] hover:bg-[#e8f5e9] disabled:opacity-60"
                >
                  {busy === 'download' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  {t('upi.download')}
                </button>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={handleShare}
                  className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#00450d] py-2 text-xs font-bold text-[#00450d] hover:bg-[#e8f5e9] disabled:opacity-60"
                >
                  {busy === 'share' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Share2 size={14} />
                  )}
                  {t('upi.share')}
                </button>
              </div>
              <p className="text-center text-[11px] text-[#525e54]">
                {t('upi.hint')}
              </p>
            </div>

            <div className="space-y-1.5 rounded-xl border border-[#e0e6e0] bg-[#f9fbf9] p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#525e54]">{t('upi.upiId')}</span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="flex min-w-0 cursor-pointer items-center gap-1 font-bold text-[#00450d]"
                >
                  <span className="truncate">{details.upiId}</span>
                  <Copy size={13} className="shrink-0" />
                </button>
              </div>
              {details.paymentNumber && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#525e54]">{t('upi.mobile')}</span>
                  <a
                    href={`tel:${details.paymentNumber.replace(/[^\d+]/g, '')}`}
                    className="flex items-center gap-1 font-bold text-[#00450d]"
                  >
                    <Phone size={13} />
                    {details.paymentNumber}
                  </a>
                </div>
              )}
            </div>

            <a
              href={upiUri}
              className="block w-full rounded-xl border border-[#00450d] py-2.5 text-center text-xs font-bold text-[#00450d] hover:bg-[#e8f5e9] sm:hidden"
            >
              {t('upi.openApp')}
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full cursor-pointer rounded-xl bg-[#00450d] py-2.5 text-xs font-bold text-white"
        >
          {t('upi.done')}
        </button>
      </div>
    </div>
  );
};
