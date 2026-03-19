/**
 * TIPID — SwipeableRow
 * A swipeable transaction row with left-swipe-to-delete and right-swipe-to-edit.
 * Uses framer-motion for smooth drag gestures.
 * Includes a built-in delete confirmation dialog.
 */
import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface SwipeableRowProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  /** Optional label shown in the confirmation dialog */
  deleteLabel?: string;
}

const SWIPE_THRESHOLD = 80;

export default function SwipeableRow({
  children,
  onEdit,
  onDelete,
  deleteLabel,
}: SwipeableRowProps) {
  const [isOpen, setIsOpen] = useState<"left" | "right" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const { lang } = useLanguage();

  // Background opacity based on drag distance
  const editBgOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const deleteBgOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  // Icon scale based on drag distance
  const editScale = useTransform(x, [0, SWIPE_THRESHOLD], [0.5, 1]);
  const deleteScale = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      // Swiped right → Edit
      onEdit();
      setIsOpen(null);
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      // Swiped left → Show delete button
      setIsOpen("left");
    } else {
      setIsOpen(null);
    }
  };

  const handleDeleteTap = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirm(false);
    setIsOpen(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setIsOpen(null);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl" ref={constraintsRef}>
        {/* Edit background (right swipe) */}
        <motion.div
          className="absolute inset-0 bg-primary flex items-center pl-4 rounded-xl"
          style={{ opacity: editBgOpacity }}
        >
          <motion.div style={{ scale: editScale }} className="flex items-center gap-2 text-primary-foreground">
            <Pencil className="w-5 h-5" />
            <span className="text-sm font-semibold">Edit</span>
          </motion.div>
        </motion.div>

        {/* Delete background (left swipe) */}
        <motion.div
          className="absolute inset-0 bg-destructive flex items-center justify-end pr-4 rounded-xl"
          style={{ opacity: deleteBgOpacity }}
        >
          <motion.div style={{ scale: deleteScale }} className="flex items-center gap-2 text-destructive-foreground">
            <span className="text-sm font-semibold">Delete</span>
            <Trash2 className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Swipeable content */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -120, right: 120 }}
          dragElastic={0.1}
          style={{ x }}
          onDragEnd={handleDragEnd}
          animate={
            isOpen === "left"
              ? { x: -SWIPE_THRESHOLD }
              : { x: 0 }
          }
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="relative z-10 cursor-grab active:cursor-grabbing"
        >
          {children}
        </motion.div>

        {/* Delete confirm button (when swiped left and held) */}
        {isOpen === "left" && (
          <button
            onClick={handleDeleteTap}
            className="absolute right-0 top-0 bottom-0 w-20 bg-destructive text-destructive-foreground flex items-center justify-center rounded-r-xl z-20"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDelete}
            />

            {/* Dialog */}
            <motion.div
              className="relative z-10 w-full max-w-sm mx-4 mb-6 sm:mb-0 bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="p-5 pb-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold font-display text-foreground">
                    {lang === "fil" ? "I-delete ang Transaction?" : "Delete Transaction?"}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mt-1 leading-relaxed">
                    {deleteLabel
                      ? lang === "fil"
                        ? `Sure ka bang gusto mong i-delete ang "${deleteLabel}"? Hindi na ito maibabalik.`
                        : `Are you sure you want to delete "${deleteLabel}"? This cannot be undone.`
                      : lang === "fil"
                        ? "Sure ka bang gusto mong i-delete ang transaction na ito? Hindi na ito maibabalik."
                        : "Are you sure you want to delete this transaction? This cannot be undone."}
                  </p>
                </div>
                <button
                  onClick={cancelDelete}
                  className="p-1 rounded-lg hover:bg-accent text-muted-foreground flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2.5 rounded-xl bg-accent text-foreground text-sm font-semibold font-body transition-colors hover:bg-accent/80 active:scale-[0.98]"
                >
                  {lang === "fil" ? "Hindi, Cancel" : "No, Cancel"}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold font-body transition-colors hover:bg-destructive/90 active:scale-[0.98]"
                >
                  {lang === "fil" ? "Oo, I-delete" : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
